// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCI0lE9HeKBcG8L7_uT2TTdBzdYrGBB8nI",
  authDomain: "zentha-ai.firebaseapp.com",
  projectId: "zentha-ai",
  storageBucket: "zentha-ai.appspot.com",
  messagingSenderId: "508988316943",
  appId: "1:508988316943:web:9eb2f29a81326d9f90f27a",
  measurementId: "G-FJS5TXSHXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    const resetForm = document.getElementById("resetForm");
    const emailInput = document.getElementById("email");
    const resetBtn = document.getElementById("resetBtn");
    const errorMessage = document.getElementById("error-message");

    resetForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            errorMessage.textContent = "Please enter your email.";
            emailInput.style.border = "1px solid red";
            return;
        }

        // Disable button for 5 seconds to prevent spam
        resetBtn.disabled = true;
        resetBtn.textContent = "You can't request another password reset email for the next 5 seconds";
        resetBtn.style.backgroundColor = "black";

        sendPasswordResetEmail(auth, email)
            .then(() => {
                errorMessage.style.color = "green";
                errorMessage.textContent = "Password reset link sent! Check your email.";
                emailInput.style.border = "1px solid green";

                // Re-enable the button after 5 seconds
                setTimeout(() => {
                    resetBtn.disabled = false;
                    resetBtn.textContent = "Reset Password";
                    resetBtn.style.backgroundColor = "";
                }, 5000);
            })
            .catch((error) => {
                console.error("Error:", error);
                errorMessage.style.color = "red";
                resetBtn.disabled = false;
                resetBtn.textContent = "Reset Password";
                resetBtn.style.backgroundColor = "";

                if (error.code === "auth/user-not-found") {
                    errorMessage.textContent = "No account found with this email.";
                } else if (error.code === "auth/invalid-email") {
                    errorMessage.textContent = "Invalid email format.";
                } else {
                    errorMessage.textContent = "Error sending reset email. Try again later.";
                }
            });
    });
});
