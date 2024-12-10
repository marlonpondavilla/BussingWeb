    import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
    import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js';
    import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
    import { firebaseConfig } from '../src/services/firebaseConfig.js';

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    // Google Sign-In button event listener
    const googleBtn = document.getElementById('google-login-btn');
    const userName = document.getElementById('user-name');

    googleBtn.addEventListener('click', () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {          
                window.location.href = '/src/pages/dashboard.html';
            })
            .catch((error) => {
                console.error('Error during sign-in: ', error.message);
                alert('Error: ' + error.message);
            });
    });

    // Check if user is signed in
    auth.onAuthStateChanged((user) => {
        if (user) {
            // userName.textContent = user.displayName;
        } else {
            console.log('User is not signed in');
        }
    });