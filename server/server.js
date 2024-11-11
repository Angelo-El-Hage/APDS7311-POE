// Import required libraries
require('dotenv').config();
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing and salting
const bodyParser = require('body-parser');  // Import body-parser to handle POST data
const mongoose = require('mongoose');
const User = require('./models/user.model')
const Transaction = require('./models/transaction.model')
const app = express();
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { MongoClient } = require('mongodb');

app.use(cors())

// Middleware for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], 
      scriptSrc: ["'self'", "trusted-cdn.com"], // Replace with actual trusted CDN
    },
  },
}));

// Connect to MongoDB using mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to database!'))
  .catch((error) => console.log('Connection failed:', error.message));

// Middleware to parse request body (important for handling POST data)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Authentication Middleware: Protect routes based on user roles (e.g., customer, employee)
const authMiddleware = (roles = []) => (req, res, next) => {
  const token = req.header('Authorization'); // Retrieve the token from Authorization header
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' }); // If no token is provided

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using secret key
    if (!roles.includes(decoded.role)) return res.status(403).json({ msg: 'Access denied' }); // Check if the role is authorized

    req.user = decoded; // Attach the user object to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ msg: 'Invalid token' }); // If the token is invalid
  }
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per `window` per 15 minutes
  message: 'Too many login attempts from this IP, please try again later.'
});

// Read your SSL certificates
const options = {
  key: fs.readFileSync('keys/privatekey.pem'),
  cert: fs.readFileSync('keys/certificate.pem')
};

// Add middleware to redirect HTTP to HTTPS (Optional for better security)
app.use((req, res, next) => {
  if (request.query.url.startsWith("http://localhost:3000/")) {
      response.redirect(request.query.url);
   }
  next();
});

// Define register route with RegEx-based whitelisting
app.post('/register', async (req, res) => {
  const {fullname, idNum, accountNum, username, email,password } = req.body;
  const url = process.env.MONGODB_URI;

  // Define RegEx patterns for whitelisting
  // const idPattern = /^\d{6}\d{4}[0-1]\d{2}$/; 
  const idPattern = /^\d{2}(0\d|1[0-2])(0\d|[12]\d|3[01])\d{4}[01]\d{2}$/; // Valid South African ID number format
  const accountPattern = /^\d{6,11}$/; // Account number pattern between 6-11 digits
  const usernamePattern = /^[a-zA-Z0-9]+$/;  // Allow only alphanumeric characters
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Basic email format
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // At least 8 characters, one uppercase, one lowercase, one number, and one special character
  const bodyParser = require('body-parser');

// Middleware to parse request bodies (important for handling POST data)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

  //This is to check if the full name is provided
  if(!fullname){
    return res.status(400).send("Full Name is required.");
  }

  // Validate id number
  if (!idPattern.test(idNum)) {
    return res.status(400).send("Invalid ID number.");
  }

  // Validate account number
  if (!accountPattern.test(accountNum)) {
    return res.status(400).send("Invalid Account Number.");
  }

  // Validate username
  if (!usernamePattern.test(username)) {
    return res.status(400).send("Invalid username: Only alphanumeric characters are allowed.");
  }

  // Validate email
  if (!emailPattern.test(email)) {
    return res.status(400).send("Invalid email format.");
  }

  // Validate password
  if (!password) {
    return res.status(400).send("Password is required.");
  }
  if (!passwordPattern.test(password)) {
    return res.status(400).send("Password must be at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.");
  }
  
  // Sanitize input fields to prevent XSS attacks y
  const sanitizedFullname = validator.escape(fullname);
  const sanitizedIdNum = validator.escape(idNum);
  const sanitizedAccountNum = validator.escape(accountNum);
  const sanitizedUsername = validator.escape(username);
  const sanitizedEmail = validator.escape(email);

  // If all validations pass, proceed to the password hashing and user creation process
  try {
    //Increased security by using 12 factors
    const saltFactors = 12;
    //Hash the plain text password with bcrypt
    const hashedPassword = await bcrypt.hash(password, saltFactors);

    // Create a new user object safely with sanitized data
    const newUser = new User({
      fullname: sanitizedFullname,
      idNum: sanitizedIdNum,
      accountNum: sanitizedAccountNum,
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword, // Store hashed password
      role: 'customer' // Default role
    });
    
    // Connect to MongoDB and insert the new user
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
      if (err) {
        console.error('Database connection error:', err);
        return res.status(500).send('Failed to connect to database');
      }

      const db = client.db(); // Access the database
      const usersCollection = db.collection('users'); // Reference to the users collection

      try {
        // Insert the new user into the database
        await usersCollection.insertOne(newUser);
        res.status(201).send('User registration successful.');
      } catch (dbError) {
        console.error('Error saving user to database:', dbError);
        res.status(500).send('Failed to save user to database');
      } finally {
        client.close(); // Ensure the connection is closed after the operation
      }
    });

  } catch (error) {
    // Catch any errors during the registration process
    console.error('Registration error encountered:', error.message);
    // Ensure that only one response is sent to the client
    return res.status(500).send('An error occurred during the registration process. Please try again later.');
  }
});

// Login user with rate limiting applied
app.post('/login', loginLimiter, (req, res) => {
  const { username, accountNumber, password } = req.body;

  if (!username || !accountNumber || !password) {
      return res.status(400).json({ message: "All fields must be filled" });
  }

  const query = { username: username };

  MongoClient.connect(url, (err, db) => {
      if (err) return res.status(500).json({ error: 'Server error' });

      db.collection("users")
          .findOne(query, (err, user) => { // Noncompliant (based on initial example)
              if (err) return res.status(500).json({ error: 'Server error' });
              
              if (!user) return res.status(400).json({ msg: 'Invalid username' });

              if (user.accountNum !== accountNumber) {
                  return res.status(400).json({ msg: 'Invalid account number' });
              }

              bcrypt.compare(password, user.password, (err, isMatch) => {
                  if (err || !isMatch) return res.status(400).json({ msg: 'Invalid password' });

                  const accessToken = jwt.sign(
                      { id: user._id, role: user.role },
                      process.env.JWT_SECRET,
                      { expiresIn: '1h' }
                  );

                  res.json({ accessToken: accessToken });
              });
          });
  });
});


// Create new payment (Customer only)
app.post('/create', authMiddleware(['customer']), async (req, res) => {
  const { amount, currency, destinationAccount, swiftCode } = req.body;
  try {
    const transaction = new Transaction({
      customerId: req.user.id,
      amount,
      currency,
      destinationAccount,
      swiftCode
    });

    await transaction.save();
    res.status(201).json({ msg: 'Transaction created' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ status: 1 }) // 1 for ascending order, sorts 'pending' before 'verified'
      .exec();

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify payment (Employee only)
app.post('/verify/:id', authMiddleware(['employee']), async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

    transaction.status = 'verified';
    await transaction.save();

    res.json({ msg: 'Transaction verified' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the IntlPaymentsApp server!');
});

//Create HTTPS server
https.createServer(options, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

//HTTP server that redirects to HTTPS
http.createServer((req, res) => {
  // Check if the URL starts with the desired pattern
  if (req.url.startsWith("https://localhost:301")) {
    // Redirect to the same URL but with HTTPS
    res.writeHead(301, { "Location": `https://${req.headers.host}${req.url}` });
    res.end();
  } else {
    // Default action if URL doesn't match
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("No redirect for this URL");
  }
}).listen(80, () => {
  console.log('HTTP server listening on port 80, redirecting to HTTPS');
});