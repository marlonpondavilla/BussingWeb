import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js'; 

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

const userName = document.getElementById('user-name');
const userIMG = document.getElementById('user-img');
const userEmail = document.getElementById('user-email'); 

auth.onAuthStateChanged((user) => {
    if (user) {
        // Display user's credentials
        userName.textContent = `Hello, ${user.displayName}`;
        userIMG.src = user.photoURL;
        userEmail.textContent = user.email;
    } else {
        console.log('User is not signed in');
        window.location.href = '/index.html';
    }
});
