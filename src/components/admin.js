import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js';
import { addDataToFirestore } from '../firebase/db.js';
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const adminname = document.getElementById('username');
const password = document.getElementById('password');
const loginButton = document.getElementById('login-btn');

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const enteredAdminName = adminname.value;
    const enteredPassword = password.value;

    // Validate input fields
    if (enteredAdminName === '' || enteredPassword === '') {
        alert('Please fill in all fields');
        return;
    } else {
        console.error('error checking fields')
    }

    try {
        // Sign in with email and password using Firebase Authentication
        const adminCredential = await signInWithEmailAndPassword(auth, enteredAdminName, enteredPassword);
        const admin = adminCredential.user;

        // Store admin data in localStorage
        localStorage.setItem('adminName', admin.displayName || 'Hello, Admin');
        localStorage.setItem('adminEmail', admin.email);
        localStorage.setItem('adminPhoto', admin.photoURL || 'https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg');

        // Prepare admin data object
        const adminDataObject = {
            uid: admin.uid,
            name: admin.displayName,
            email: admin.email,
            photoURL: admin.photoURL,
            createdAt: new Date()
        };

        // Add admin to Firestore
        await addDataToFirestore('AdminLoggedInCollection', adminDataObject);

        // check if is admin
        if (admin.email.includes('@admin.com')) {
            window.location.href = '../pages/adminDashboard.html';
        } else {
            alert('only admin can login, try logging in to user dashboard');
        }

    } catch (error) {
        // Handle Firebase authentication errors
        if (error.code === 'auth/invalid-email') {
            alert('Invalid email address');
        } else if (error.code === 'auth/invalid-login-credentials') {
            alert('Invalid adminname or password');
        } else
            console.error(error)
    }
});


