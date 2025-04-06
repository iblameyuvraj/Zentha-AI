document.addEventListener("DOMContentLoaded", function () {
    if (typeof emailjs !== "undefined") {
        emailjs.init("bTqjAGYTt67AAUbQV"); // Ensure this is correct
        console.log("EmailJS initialized.");
    } else {
        console.error("EmailJS failed to load.");
    }
});

const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');

const successMessage = document.getElementById('success-message');
const closeSuccess = document.getElementById('close-success');

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Clear error messages
function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
}

// Form submission handler
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // Validate name
    if (nameInput.value.trim() === '') {
        nameError.textContent = 'Name is required';
        isValid = false;
    }

    // Validate email
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }

    // Validate message
    if (messageInput.value.trim() === '') {
        messageError.textContent = 'Message is required';
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message must be at least 10 characters';
        isValid = false;
    }

    // If form is valid, send email
    if (isValid) {
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };

        console.log("Sending email with data:", formData); // Debugging output

        emailjs.send("service_prspoc4", "template_l78nz23", formData)
            .then((response) => {
                console.log("Email sent successfully!", response);
                successMessage.classList.remove('hidden');
                contactForm.reset();
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
                alert("sent");
            });
    }
});

// Close success message
closeSuccess.addEventListener('click', function () {
    successMessage.classList.add('hidden');
});

// Close success message when clicking outside the content
successMessage.addEventListener('click', function (e) {
    if (e.target === successMessage) {
        successMessage.classList.add('hidden');
    }
});


