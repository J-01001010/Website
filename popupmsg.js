document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        sendFormData(form);
    });

    function sendFormData(form) {
        const formData = new FormData(form);

        // Get the exact value of a form field
        const exactValue = formData.get('name-of-form-field');

        // Log the exact value to the console
        console.log(exactValue);

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
});