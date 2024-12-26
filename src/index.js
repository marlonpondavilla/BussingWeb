import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../src/services/firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

// Google Sign-In button event listener
const googleBtn = document.getElementById('google-login-btn');
const loginBtn = document.getElementById('login-btn');

googleBtn.addEventListener('click', () => {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            const user = result.user;
            // Store user information in localStorage or session storage
            localStorage.setItem('userName', user.displayName);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userPhoto', user.photoURL);
        })
        .catch((error) => {
            console.error('Error during sign-in: ', error.message);
            alert('Error: ' + error.message);
        });
});

// Login (username and password)
const username = document.getElementById('username');
const password = document.getElementById('password');

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const enteredUsername = username.value;
    const enteredPassword = password.value;

    if (enteredUsername === '' || enteredPassword === '') {
        alert('All fields are required');
        return;
    }

    // Attempt to log in with Firebase Authentication
    try {
        // Sign in with email and password using Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, enteredUsername, enteredPassword);
        const user = userCredential.user;

        // Store user data in localStorage
        localStorage.setItem('userName', user.displayName || 'Hello, User');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userPhoto', user.photoURL || 'https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg');

        alert('You are now logged in');
        window.location.href = './pages/mainDashboard.html';
    } catch (error) {
        console.error('Error during sign-in: ', error.message);
        alert('Incorrect username or password');
    }
});

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user !== null) {
        console.log('User is logged in');
        // Redirect to dashboard
        window.location.href = './pages/mainDashboard.html';
    } else {
        console.log('No user');
    }
});
