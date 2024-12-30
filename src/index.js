import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../src/services/firebaseConfig.js';
import { addUserToFirestore } from './firebase/db.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

// Google Sign-In button event listener
const googleBtn = document.getElementById('google-login-btn');
const loginBtn = document.getElementById('login-btn');

googleBtn.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Store user information in localStorage
        localStorage.setItem('userName', user.displayName);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userPhoto', user.photoURL);

        const userDataObject = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: new Date()
        };

        // Add user to Firestore
        await addUserToFirestore(userDataObject); 

        // Redirect to the main dashboard after the user is added
        window.location.href = './pages/mainDashboard.html';
    } catch (error) {
        console.error('Error during sign-in: ', error.message);
        alert('Error: ' + error.message);
    }
});



// Login (username and password)
const username = document.getElementById('username');
const password = document.getElementById('password');
const errMsg = document.getElementById('error-message');

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const enteredUsername = username.value;
    const enteredPassword = password.value;

    // Validate input fields
    if (enteredUsername === '' || enteredPassword === '') {
        errMsg.classList.remove('hidden');
        return;
    } else{
        username.classList.remove('border-red-500');
        password.classList.remove('border-red-500');
        errMsg.classList.add('hidden');
    }

    try {
        // Sign in with email and password using Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, enteredUsername, enteredPassword);
        const user = userCredential.user;

        // check if is admin
        if(user.email.includes('bussing.com')){
            console.log(user.email, 'is an admin');
        } else{
            console.log(user.email, 'is not an admin');
        }

        // Store user data in localStorage
        localStorage.setItem('userName', user.displayName || 'Hello, User');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userPhoto', user.photoURL || 'https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg');

        // Prepare user data object
        const userDataObject = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: new Date()
        };

        // Add user to Firestore
        await addUserToFirestore(userDataObject); 
        window.location.href = './pages/mainDashboard.html';
    } catch (error) {
        // Handle Firebase authentication errors
        if(error.code === 'auth/invalid-email') {
            errMsg.classList.remove('hidden');
            username.classList.add('border-red-500');
            errMsg.textContent = 'Invalid email address*';
        } else if(error.code === 'auth/invalid-login-credentials'){
            errMsg.classList.remove('hidden');
            username.classList.add('border-red-500');
            password.classList.add('border-red-500');
            errMsg.textContent = 'Invalid username or password*';
        }
        console.error(error)
    }
});

