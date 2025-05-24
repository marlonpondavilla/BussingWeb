import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js';
import { addDataToFirestore } from '../firebase/db.js';
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const adminname = document.getElementById('username');
const password = document.getElementById('password');
const loginButton = document.getElementById('login-btn');
const errorPopUp = document.getElementById('error-popup');
const errorPopUpClose = document.getElementById('error-popup-close');
const errorPopUpHeader = document.getElementById('error-popup-header');
const errorPopUpMessage = document.getElementById('error-popup-message');

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const enteredAdminName = adminname.value;
    const enteredPassword = password.value;

    // Validate input fields
    if (enteredAdminName === '' || enteredPassword === '') {
        errorPopUp.classList.add('flex')
        errorPopUp.classList.remove('hidden');
        errorPopUpHeader.innerHTML = "All fields are required.";
        errorPopUpMessage.innerHTML = "Please fill out all the necessary information";
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
            errorPopUp.classList.add('flex')
            errorPopUp.classList.remove('hidden');
            errorPopUpHeader.classList.add('hidden');
            errorPopUpMessage.innerHTML = "Invalid email type, please check your email and try again";
        } else if (error.code === 'auth/invalid-login-credentials') {
            errorPopUp.classList.add('flex')
            errorPopUp.classList.remove('hidden');
        } else
            console.error(error)
    }
});

errorPopUpClose.addEventListener('click', () => {
    errorPopUp.classList.add('hidden');
})


