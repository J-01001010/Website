'use strict';
const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');

const url = 'mongodb+srv://albertzkie:Ewankonga123@pvhosms.jghekic.mongodb.net/';
const dbName = 'pvhosms_db';
const collectionName = 'reserved';

async function queryAndPopulateCalendar() {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Query the collection for data
    const data = await collection.find({}).toArray();

    // Close the MongoDB connection
    client.close();

    // Get a reference to the calendar and calendar-days elements
    const calendar = document.getElementById('calendar');
    const calendarDays = document.getElementById('calendar-days');

    // Clear the existing calendar days
    calendarDays.innerHTML = '';

    // Loop through the data and populate the calendar
    data.forEach(item => {
      const date = moment(item.date); // Assuming 'date' is the field name in your MongoDB
      const day = date.date();
      const cell = document.createElement('div');
      cell.textContent = day;
      cell.classList.add('day');

      // You can add more styling or logic based on the data if needed

      calendarDays.appendChild(cell);
    });

    // Update the month-year header (you can use moment.js to format it nicely)
    const currentMonth = moment();
    document.getElementById('month-year').textContent = currentMonth.format('MMMM YYYY');
  } catch (error) {
    console.error('Error querying MongoDB:', error);
  }
}

// Call the function to populate the calendar
queryAndPopulateCalendar();
