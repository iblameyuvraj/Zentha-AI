// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    sendEmailVerification, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore-lite.js";

// Config
const firebaseConfig = {
    apiKey: "AIzaSyCI0lE9HeKBcG8L7_uT2TTdBzdYrGBB8nI",
    authDomain: "zentha-ai.firebaseapp.com",
    projectId: "zentha-ai",
    storageBucket: "zentha-ai.appspot.com",
    messagingSenderId: "508988316943",
    appId: "1:508988316943:web:9eb2f29a81326d9f90f27a",
    measurementId: "G-FJS5TXSHXE"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitBtn = document.getElementById("submit");
    const loginBtn = document.getElementById("login");

    // Init EmailJS
    const emailJsPublicKey = "bTqjAGYTt67AAUbQV"; // Your EmailJS Public Key
    emailjs.init(emailJsPublicKey);

    // Sign Up
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                sendEmailVerification(user)
                    .then(() => {
                        alert("Verification email sent! Please check your inbox before logging in.");
                        console.log("Verification email sent.");
                        signOut(auth); // Force logout until verified
                    })
                    .catch((error) => {
                        console.error("Failed to send verification email:", error);
                        alert("Could not send verification email.");
                    });
            })
            .catch((error) => {
                console.error("Signup error:", error);
                alert(`Signup failed: ${error.message}`);
            });
    });

    // Login
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                return user.reload().then(() => {
                    if (!user.emailVerified) {
                        alert("Email not verified! Please verify first.");
                        sendEmailVerification(user)
                            .then(() => alert("Verification email re-sent. Check your inbox."))
                            .catch((err) => console.error("Resend error:", err));
                        signOut(auth);
                        return;
                    }

                    console.log("Login successful:", user.email);
                    sendWelcomeEmail(user.email, "User");
                    window.location.href = "/FRONTEND/chat/home.html";
                });
            })
            .catch((error) => {
                console.error("Login error:", error);
                alert(`Login failed: ${error.message}`);
            });
    });

    // Auth State Change (Optional)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            user.reload().then(() => {
                if (!user.emailVerified) {
                    console.log("Unverified user still logged in. Signing out...");
                    signOut(auth);
                }
            });
        }
    });

    // Send Welcome Email
    function sendWelcomeEmail(userEmail, userName) {
        const serviceID = "service_x1gc05p";     // Replace
        const templateID = "template_q7nzrw4";   // Replace

        const params = {
            to_email: userEmail,
            name: userName,
        };

        emailjs.send(serviceID, templateID, params)
            .then(() => console.log("Welcome email sent"))
            .catch((err) => console.error("Welcome email error:", err));
    }
});
