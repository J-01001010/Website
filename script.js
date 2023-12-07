document.getElementById('event-reservation-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from actually submitting

    // Validate the form fields
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const event = document.getElementById('event').value;
    const date = document.getElementById('date').value;
    const guests = document.getElementById('guests').value;

    if (!name || !email || event === '-' || !date || !guests) {
        alert('Please fill out all required fields.');
        return;
    }

    // Show a confirmation dialog
    const confirmation = confirm('Are you sure you want to submit this form?');

    if (confirmation) {
        // If the user clicks OK, submit the form data to the server
        fetch('/submit', {
            method: 'POST',
            body: new FormData(this),
        })
        .then((response) => {
            if (response.ok) {
                // If the submission was successful, reset the form
                this.reset();

                // Display a customer service message
                alert('Your reservation has been submitted successfully. Our customer service will contact you shortly.');
            } else {
                // Handle errors if the submission fails
                alert('An error occurred while submitting the form. Please try again later.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while submitting the form. Please try again later.');
        });
    }
});