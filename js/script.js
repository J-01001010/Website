'use strict';
document.addEventListener('DOMContentLoaded', function () {
  const calendarDays = document.getElementById('calendar-days');
  const monthYear = document.getElementById('month-year');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');    
  const eventForm = document.getElementById('event-reservation-form'); 

  let currentDate = new Date();

  function renderCalendar() {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startDayIndex = firstDay.getDay();

    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
    let daysHTML = '';

    for (let i = 0; i < startDayIndex; i++) {
      daysHTML += `<div class="other-month"></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === currentDate.getDate() && currentDate.getMonth() === new Date().getMonth();
      daysHTML += `<div class="${isToday ? 'today' : ''}">${i}</div>`;
    }

    calendarDays.innerHTML = daysHTML;
  }

  renderCalendar();

  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  // Add the code for handling form submission, displaying a pop-up message, and refreshing the webpage
  const submitButton = document.getElementById('submit'); 

  submitButton.addEventListener('click', () => {
    fetch('/submit', {
      method: 'POST',
      body: new FormData(eventForm),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Form submission failed');
        }
        return response.text();
      })
      .then((responseText) => {
        alert('Form submitted successfully');
        eventForm.reset();
      })  
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the form');
      });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    sendFormData(form);
  });

  function sendFormData(form) {
    const formData = new FormData(form);

    // Log the form data to the console for debugging
    for (const [name, value] of formData) {
      console.log(name + ': ' + value);
    }

    fetch('/submit-form', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Data saved and email sent successfully') {
          // Display a success message using an alert or any other UI element
          alert('Form submitted successfully');
          form.reset(); // Clear the form fields if needed
        } else {
          // Display an error message using an alert or any other UI element
          alert('Form submission failed');
        }
      })
      .catch((error) => {
        // Handle network errors or other issues
        console.error('Error:', error);
        alert('An error occurred while submitting the form');
      });
  }
  // Create a button element.
const downloadButton = document.createElement('button');

// Set the button's text.
downloadButton.textContent = 'Download App';

// Set the button's class.
downloadButton.classList.add('download-button');

// Add an event listener to the button.
downloadButton.addEventListener('click', function() {
  // Display an alert message.
  alert('The application that you want to download is under development. Please wait for another time to download the app.');
});

// Add the button to the document.
document.body.appendChild(downloadButton);


//////////////

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("reserved-date-button");
  const cardContainer = document.getElementById("floating-card");
  const contentContainer = document.getElementById("content"); // This container will hold the data
  let cardVisible = false;

  button.addEventListener("click", function () {
    cardVisible = !cardVisible;

    if (cardVisible) {
      cardContainer.style.display = "block";

      // Fetch data from MongoDB
      fetch("/getDataFromMongoDB?collectionName=reserved")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response error. Please try again.");
          }
          return response.json();
        })
        .then((data) => {
          if (contentContainer) {
            contentContainer.innerHTML = ""; // Clear previous content

            if (data.length > 0) {
              data.forEach((record) => {
                const cardContent = `
                  <p>Name: ${record.name}</p>
                  <p>Event: ${record.event}</p>
                  <p>Date: ${record.date}</p>
                  <p>Guest: ${record.guest}</p>
                `;
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = cardContent;
                contentContainer.appendChild(card);
              });
            } else {
              contentContainer.innerHTML = "<p class='no-data'>No data found</p>";
            }
          } else {
            console.error("Element with id 'content' not found.");
          }
        })
        .catch((error) => {
          console.error("Error during data retrieval:", error);
        });
    } else {
      cardContainer.style.display = "none";
    }
  });
});
// Get the elements you want to show/hide
    const oneDayDiv = document.getElementById("one-day");
    const selectDateDiv = document.getElementById("select-date");
    const daysOfEventInput = document.getElementById("days-of-event");
    const dateNumber = document.getElementById("date-number");

    // Hide the date-number initially
    dateNumber.style.display = "none";

    // Add an event listener to the days-of-event input
    daysOfEventInput.addEventListener("input", function () {
        const daysValue = parseInt(daysOfEventInput.value);

        if (daysValue === 1) {
            oneDayDiv.style.display = "block";
            selectDateDiv.style.display = "none";
            dateNumber.style.display = "block"; // Show the parent container
        } else if (daysValue >= 2 && daysValue <= 30) {
            oneDayDiv.style.display = "none";
            selectDateDiv.style.display = "block";
            dateNumber.style.display = "block"; // Show the parent container
        } else {
            oneDayDiv.style.display = "none";
            selectDateDiv.style.display = "none";
            dateNumber.style.display = "none";
        }
    });
async function login(username, password) {
  try {
    // Use bcrypt to hash the provided password and compare with the hashed password in the database
    const user = await Residence.findOne({ username }).exec();

    if (user && bcrypt.compareSync(password, user.password)) {
      // If login is successful, perform a fetch request
      const response = await fetch('http://your-api-endpoint.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Redirect to the index page on successful login
        console.log('Login successful');
        // You can handle the response here, if needed
      } else {
        // Display a message for failed fetch request
        console.error('Fetch request failed:', response.statusText);
      }
    } else {
      // Display a message for incorrect login
      console.error('Incorrect username or password. This website is exclusive only for residents of Monte Briza village.');
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
  }
}


// //------------------------------------------------//
// document.addEventListener("DOMContentLoaded", function () {
//   const loginForm = document.getElementById("loginForm");

//   loginForm.addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const formData = new FormData(loginForm);
//     const response = await fetch("/login", {
//       method: "POST",
//       body: formData,
//     });

//     const responseData = await response.json();

//     // Display the response message on the webpage
//     const messageContainer = document.getElementById("messageContainer");
//     messageContainer.innerText = responseData.message;

//     // You can customize further actions based on the response, e.g., redirecting
//     if (response.ok) {
//       window.location.href = "/index.html";
//     }
//   });
// });
// //-----------------------------------------------//
// //
// function myFunction() {
//   var x = document.getElementById("myInput");
//   if (x.type === "password") {
//     x.type = "text";
//   } else {
//     x.type = "password";
//   }
// }
// ///
// });
// app.use((req, res, next) => {
//   console.log('Incoming request:', req.method, req.url);
//   console.log('Request headers:', req.headers);
//   console.log('Request body:', req.body);
//   next();
// });
function login(username, password) {
  // Make a Fetch API request
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not okay');
      }
      return response.json(); // assuming the server responds with JSON
    })
    .then(data => {
      // Handle different server responses
      if (data.message === 'Login successful') {
        console.log('Login successful');
        window.location.href = '/index.html'; // Redirect upon successful login
      } else if (data.message === 'Username does not exist.') {
        console.log('Username does not exist');
        alert('Username does not exist. Please check your username and try again.');
      } else if (data.message === 'Incorrect password') {
        console.log('Incorrect password');
        alert('Incorrect password. Please check your password and try again.');
      } else {
        console.error('Unexpected server response:', data);
        alert('An error occurred. Please try again later.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    });
}
function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  fetch('/login', {
      method: 'POST',
      body: formData
  })
  .then(response => response.text())
  .then(message => {
      alert(message);
  })
  .catch(error => {
      console.error(error);
      alert('An error occurred. Please try again.');
  });
}


// Example usage:
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Assuming this function is triggered by a form submission or button click
function handleLoginSubmit(event) {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  login(username, password);
}

// Attach the login function to a form submit event
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', handleLoginSubmit);

});