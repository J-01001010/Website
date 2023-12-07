'use strict';
const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv'); //dotenv package for environment variables
const rateLimit = require('express-rate-limit'); //rate limiting package
const helmet = require('helmet'); //helmet for security headers
const nodemailer = require('nodemailer')
const app = express();
const bcrypt = require("bcrypt")
const ObjectId = require('mongodb').ObjectId
const fetch = require('node-fetch');

const port = process.env.PORT || 3000; 

// Connection URL
const url = 'mongodb+srv://albertzkie:Ewankonga123@pvhosms.jghekic.mongodb.net/'; 
const dbName = 'pvhosms_db'; //aguilarpogi123 //mongodb+srv://aguilarpogi123:aguilarpogi123@cluster0.6ivk8ks.mongodb.net/
const collectionName = 'reserved'; 
const residenceCollectionName = 'residence';

// // Connect to MongoDB
// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
//   if (err) {
//     console.error('Error connecting to MongoDB:', err);
//     return;
//   }

//   const db = client.db(dbName);
//   const collection = db.collection(collectionName); // Define the collection here

//   // Define an API endpoint to retrieve data
//   app.get('/getData', (req, res) => {
//     collection.find({}).toArray((err, data) => {
//       if (err) {
//         console.error('Error retrieving data:', err);
//         res.status(500).send('Internal Server Error');
//       } else {
//         res.json(data);
//       }
//     });
//   });
// });

// // // // // // // // // // // //
const cors = require('cors');

// Enable CORS middleware
app.use(cors());
// const https = require('https');
// const http = require('http');
// const fs = require('fs');
// const cors = require('cors'); 

// const options = {
//   key: fs.readFileSync('/path/to/private-key.pem'), // Update with your private key path
//   cert: fs.readFileSync('/path/to/ssl-certificate.pem'), // Update with your SSL certificate path
// };

// const httpsServer = https.createServer(options, app);

// httpsServer.listen(443, () => {
//   console.log('HTTPS server is running on port 443');
// });

// const httpServer = http.createServer((req, res) => {
//   res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
//   res.end();
// });

// httpServer.listen(80, () => {
//   console.log('HTTP server for redirection is running on port 80');
// });

// Keep passwords, API keys, and other sensitive data out of your code
dotenv.config();
// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));
// Add middleware to parse JSON
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(bodyParser.json());
//---------------------------------------//

// // Serve the React static files
// app.use(express.static(path.join(__dirname, 'react-app/build')));

// // Serve the login form (assuming LoginForm.js is part of your React app)
// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'react-app/build/LoginForm.js'));
// });
//----------------express.js-----------------//
// Serve HTML files from the 'views' directory
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'loginform.html');
  res.sendFile(filePath);
});
app.get('/loader.html', (req, res, next) => {
  setTimeout(() => {
    res.redirect('/index.html');
  }, 5000); // 5000 milliseconds (5 seconds)
});

// Serve other HTML files
const htmlFiles = ['index', 'loader', 'about', 'contact', 'download', 'project', 'service', 'submit', 'testimonial', 'loginform'];
htmlFiles.forEach((file) => {
  app.get(`/${file}.html`, (req, res) => {
    const filePath = path.join(__dirname, `${file}.html`);
    res.sendFile(filePath);
  });
});
//----------------express.js-----------------//

// Connect to MongoDB
mongoose.connect(url + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
 

// Define a schema for reservations
const reservationSchema = new mongoose.Schema({
  rfid: { type: String, required: true },
  name: { type: String, required: true },
  residency: { type: String, required: true },
  email: { type: String, required: true },
  event: { type: String, required: true },
  daysOfEvent: {type: Number, required: true},   
  oneDate: {type: String, required: false},        
  timeFromOne: {type: String, required: false},     
  timeToOne: {type: String, requied: false},    
  dateFrom: {type: String, requied: false},       
  timeFrom: {type: String, requied: false},       
  dateTo: {type: String, requied: false},          
  timeTo: {type: String, requied: false}, 
  guests: { type: Number, required: true },
  status: { type: String, default: 'Pending request' },       
});
 
// Create a reservation model based on the schema
const Reservation = mongoose.model('Reservation', reservationSchema);
// Handle form submission
app.post('/submit', (req, res) => {
  // Extract form data
  const {
    rfid,
    name,
    residency,
    email,
    event,
    guests,
    status,
    daysOfEvent,
    oneDate,
    timeFromOne,
    timeToOne,
    dateFrom,
    timeFrom,
    dateTo,
    timeTo,
  } = req.body;

  if (residency === 'Resident') {
  // Check RFID value in the 'residence' collection
  Residence.findOne({
    "Resident id(RFID no)": rfid,
  })
    .then((residence) => {
      if (!residence){
        // RFID value does not match any resident
        console.log('RFID not found for resident');
        return res.status(400).send('Invalid RFID for resident');
      }
      // Continue with the reservation logic
      handleReservation(res, rfid, name, residency, email, event, guests, status, daysOfEvent, oneDate, timeFromOne, timeToOne, dateFrom, timeFrom, dateTo, timeTo);
    })
    .catch((error) => {
      console.error('Error checking RFID for resident:', error);
      res.status(500).send('Internal Server Error');
    });
} else {
  // Continue with the reservation logic for non-residents
  handleReservation(res, rfid, name, residency, email, event, guests, status, daysOfEvent, oneDate, timeFromOne, timeToOne, dateFrom, timeFrom, dateTo, timeTo);
}

});

// Function to handle reservation logic
function handleReservation(res, rfid, name, residency, email, event, guests, status, daysOfEvent, oneDate, timeFromOne, timeToOne, dateFrom, timeFrom, dateTo, timeTo) {
  // Check if a reservation with the same date or overlapping dates already exists
  Reservation.findOne({
    oneDate: oneDate,
    $or: [
      {
        dateFrom: { $lt: dateTo },
        dateTo: { $gt: dateFrom },
      },
      {
        dateFrom: { $lt: dateTo },
        dateTo: { $eq: dateFrom },
      },
      {
        dateFrom: { $eq: dateTo },
        dateTo: { $gt: dateFrom },
      },
      // Additional condition to handle null values
      {
        $or: [
          { dateFrom: null, dateTo: { $gt: dateFrom } },
          { dateFrom: { $lt: dateTo }, dateTo: null },
        ],
      },
    ],
  })
    .then((existingReservation) => {
      if (existingReservation) {
        // A reservation with overlapping dates already exists
        console.log('Reservation conflict: Overlapping date ranges');
        return res.status(400).send('A reservation with overlapping date ranges already exists');
      } else if (dateFrom && dateTo && dateFrom >= dateTo) {
        // Invalid date range
        console.log('Invalid date range: dateFrom should be before dateTo');
        return res.status(400).send('Invalid date range');
      } else {
        // Create a new reservation
        const formattedOneDate = oneDate ? formatDate(oneDate) : null;
        const reservation = new Reservation({
          rfid,
          name,
          residency,
          email,
          event,
          guests,
          status,
          daysOfEvent,
          oneDate: formattedOneDate,
          timeFromOne,
          timeToOne,
          // Check for null values and format accordingly
          dateFrom: dateFrom ? formatDate(dateFrom) : null,
          timeFrom,
          dateTo: dateTo ? formatDate(dateTo) : null,
          timeTo,
        });

        // Save the reservation to the database
        reservation.save()
          .then(() => {
            console.log('Reservation saved successfully');
            res.send('Reservation submitted successfully');
          })
          .catch((error) => {
            console.error('Error saving reservation:', error);
            res.status(500).send('Internal Server Error');
          });
      }
    })
    .catch((error) => {
      console.error('Error checking for existing reservations:', error);
      res.status(500).send('Internal Server Error');
    });
}

// Helper function to format the date
function formatDate(inputDate) {
  if (inputDate) {
    const dateObj = new Date(inputDate);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[dateObj.getMonth()];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`;
  }
  return null;
}


// Define a Mongoose schema for your data
const formDataSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  message: String,
});

// Change the model name to something else, e.g., FormDataModel
const FormDataModel = mongoose.model('FormData', formDataSchema);

// Set up a route to handle form submissions
app.post('/submit-form', (req, res) => {
  const formData = new FormDataModel({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    message: req.body.message,
  });

  formData.save()
    .then(() => {
      console.log('Data saved successfully');
      
      // Create a Nodemailer transporter with your Gmail credentials
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'johnphilipaguilar021@gmail.com',
          pass: 'ctir psze haez cdem', // app-specific password for security
        },
      }); 

      // Define the email data
      const mailOptions = { 
        from: `${formData.email}`, // Use template literals to insert the email dynamically
        to: 'johnphilipaguilar021@gmail.com',
        subject: 'PVHSMS Complains',
        text: `
          Name: ${formData.name}
          Phone Number: ${formData.phoneNumber}
          Email: ${formData.email}
          Message: ${formData.message}
        `,
      };
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Error sending email' });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Thank you for your message. We have received it and will be in touch soon. We hope that your message will passed to our HOA Admin as soon as possible.' });
        }
      });
    })
    .catch((err) => {
      console.error('Error saving data:', err);
      res.status(500).json({ error: 'Error saving data' });
    });
});

/////////////////////////////////////////////////
// // Display Data from Reserved form
app.get('/getDataFromMongoDB', (req, res) => {
  // Connect to the MongoDB database
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      res.status(500).send('Error connecting to MongoDB');
      return;
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch data from MongoDB
    collection.find({}).toArray((err, data) => {
      if (err) {
        console.error('Error querying MongoDB:', err);
        res.status(500).send('Error querying MongoDB');
        client.close();
      } else {
        // Send the data as JSON response
        res.json(data);
        // Close the MongoDB connection
        client.close();
      }
    });
  });
});


//------------------login form--------------------//
app.use(bodyParser.json());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await authenticateUser(username, password);
    if (result.success) {
      console.log('Login successful');
      res.send('Login successful');
    } else {
      console.log('Invalid username or password');
      res.send('Invalid username or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

async function authenticateUser(username, password) {
  const client = new MongoClient("mongodb+srv://albertzkie:Ewankonga123@pvhosms.jghekic.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("pvhosms_db");
    const collection = database.collection("residence");
    const filter = {
      username: username,
      password: password,
    };
    const user = await collection.findOne(filter);
    if (user) {
      return { success: true };
    } else {
      return { success: false };
    }
  } finally {
    await client.close();
  }
}
//-----------------------login-------------------//


// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Helmet middleware for security headers
app.use(helmet());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

