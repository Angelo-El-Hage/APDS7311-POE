const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        fullname:{
            type: String,
            require: true
        }, 

        idNum:{
            type: Number,
            require: true
        }, 
        
        accountNum:{
            type: Number,
            require: true
        }, 
        
        username:{
            type: String,
            require: true
        }, 
        
        email:{
            type: String,
            require: true
        }, 

        role: { 
            type: String, 
            enum: ['customer', 'employee'],             
            default: 'customer', // Set default role to 'customer'
            required: true 
        }, 

        password:{
            type: String,
            require: true
        }
    }, 

    {
        timestamps: true
    }
);

const User = mongoose.model("User", UserSchema)
module.exports = User;