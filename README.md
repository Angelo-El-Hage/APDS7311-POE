### Members

• Lisolethu Yanga Badi (ST10032396)<br/>
• Juniveva Alcandra (ST10208205)<br/>
• Virginia Lebogang Banda (ST10091636)<br/>
• Immar Junior Dzingwa (ST10122269)<br/>
• Angelo El-Hage (ST10156147)<br/>

### Youtube/Video link
https://youtu.be/sYRgL6YVKfE

### Circlei-ci pipeline and SonarQube
<img width="1440" alt="Circle-ci Passed all checks" src="https://github.com/user-attachments/assets/e02e9c20-d413-4b5d-8831-583c0a961d17">

<img width="1440" alt="Succesfully Passed Checks" src="https://github.com/user-attachments/assets/d69c61fa-dd0b-478b-ad5e-e4b9f499441b">
<img width="1440" alt="Failed because no Unit Tests 1" src="https://github.com/user-attachments/assets/d1d39f62-c9a2-43f5-8c39-56d44fa2ace1">
<img width="1440" alt="Failed because no Unit Tests 2" src="https://github.com/user-attachments/assets/c2329b13-28d1-42b5-94bb-311ed79a9157">

### Important notes
When testing the app using the React client it doesnt send data to the server side. But when you run using postman and the react app link it works.<br/>
Before testing the data, please open the termianl in vs code and type the following commands:<br/>
1. cd server
2. npm run serve
3. open a new terminal
4. cd client
5. npm start
<br/>
To test the verify transaction use the following credentials:<br/>
{
  "username": "saralee",
  "accountNumber": "987654321",
  "password": "P@ssw0rd123"
}
