import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../src/services/firebaseConfig.js';
import { addUserToFirestore } from './firebase/db.js';

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
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'user' && password === 'user') {
        // Store hardcoded data in localStorage
        localStorage.setItem('userName', 'Hello, User');
        localStorage.setItem('userEmail', 'user@example.com');
        localStorage.setItem('userPhoto', 'https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg');
        alert('You are now logged in');
        window.location.href = './pages/mainDashboard.html';
    } else if(username === '' || password === '') {
        alert('All fields are required');
    } else {
        alert('Incorrect username or password');
    }
});

// Listen for authentication state changes and insert data into Firestore
onAuthStateChanged(auth, async (user) => {
    if (user !== null) {
        console.log('User is logged in');

        // Prepare user data to insert into Firestore
        const userData = {
            uid: user.uid,
            name: user.displayName || 'Anonymous',
            email: user.email,
            photoURL: user.photoURL,
            createdAt: new Date(),
        };

        try{
            // Insert the user data into Firestore
            await addUserToFirestore(userData);

            window.location.href = './pages/mainDashboard.html';
        } catch(e){
            console.error('Error adding user data to Firestore: ', e);
            alert('There was an error while saving user data.');
        }

    } else {
        console.log('No user');
    }
});
