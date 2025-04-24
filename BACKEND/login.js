// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    sendEmailVerification, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey:"AIzaSyCI0lE9HeKBcG8L7_uT2TTdBzdYrGBB8nI",
  authDomain: "zentha-ai.firebaseapp.com",
  projectId: "zentha-ai",
  storageBucket: "zentha-ai.appspot.com",
  messagingSenderId: "508988316943",
  appId: "1:508988316943:web:9eb2f29a81326d9f90f27a",
  measurementId: "G-FJS5TXSHXE"
};

if (!firebaseConfig.apiKey) {
    console.error("Error: Firebase API key is missing. Check your .env file.");
    alert("Firebase configuration error. Please contact support.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Firebase initialized for login.");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded for login.");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login");

    if (!emailInput || !passwordInput || !loginBtn) {
        console.error("Error: One or more login form elements not found!");
        return;
    }

    loginBtn.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Login button clicked.");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        console.log(`Attempting to log in as: ${email}`);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return user.reload().then(() => {
                    if (!user.emailVerified) {
                        alert("Email not verified. Please check your inbox.");
                        sendEmailVerification(user)
                            .then(() => alert("Verification email re-sent."))
                            .catch((err) => console.error("Verification email resend error:", err));
                        signOut(auth);
                        return;
                    }

                    console.log("User verified and logged in:", user.email);
                    alert(`Welcome back, ${user.email}!`);
                    window.location.href = "/FRONTEND/chat/home.html";
                });
            })
            .catch((error) => {
                console.error("Error during login:", error.code, error.message);

                let errorMessage = "Login failed. Please try again.";
                if (error.code === "auth/invalid-email") {
                    errorMessage = "Invalid email format.";
                } else if (error.code === "auth/user-not-found") {
                    errorMessage = "No account found with this email.";
                } else if (error.code === "auth/wrong-password") {
                    errorMessage = "Incorrect password.";
                } else if (error.code === "auth/too-many-requests") {
                    errorMessage = "Too many attempts. Please try again later.";
                }

                alert(`Login Failed: ${errorMessage}`);
            });
    });
});
