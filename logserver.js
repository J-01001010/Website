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
const bcrypt = require("bcrypt")
const ObjectId = require('mongodb').ObjectId
const fetch = require('node-fetch');

const app = express();
const port = 3000;

// Connection URL
const url = 'mongodb+srv://albertzkie:Ewankonga123@pvhosms.jghekic.mongodb.net/'; 
const dbName = 'pvhosms_db';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// Add middleware to parse JSON
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(bodyParser.json());
//---------------------------------------//

// Serve HTML files from the 'views' directory
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'loginform.html');
  res.sendFile(filePath);
});

// Serve other HTML files
const htmlFiles = ['index', 'about', 'contact', 'download', 'project', 'service', 'submit', 'testimonial'];
htmlFiles.forEach((file) => {
  app.get(`/${file}.html`, (req, res) => {
    const filePath = path.join(__dirname, `${file}.html`);
    res.sendFile(filePath);
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await authenticateUser(username, password);

    if (result.success) {
        console.log('Login successful');
        res.redirect('/index.html');
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
