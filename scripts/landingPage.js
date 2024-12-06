import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../scripts/firebaseConfig.js'; 

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

const userName = document.getElementById('user-name');
const userIMG = document.getElementById('user-img');
const userID = document.getElementById('user-id'); 

auth.onAuthStateChanged((user) => {
    if (user) {
        // Display user's credentials
        userName.textContent = `Hello, ${user.displayName}`;
        userIMG.src = user.photoURL;
        userID.textContent = user.uid;
    } else {
        console.log('User is not signed in');
        window.location.href = '/index.html';
    }
});
