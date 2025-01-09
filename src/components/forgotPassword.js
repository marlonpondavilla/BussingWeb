import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js';
import { showSuccessAlert } from '../utils/alert.js';

// Initialize Firebase App and Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const resetPassErr = document.getElementById('reset-pass-error');
const resetPassErrMessage = document.getElementById('reset-pass-error-message');

async function sendPasswordReset(email) {
    try {
        // Ensure email is trimmed and lowercase to avoid formatting issues
        const formattedEmail = email.trim().toLowerCase();

        // Send the password reset email using Firebase
        await sendPasswordResetEmail(auth, formattedEmail);
        
        // Show success alert if the email was sent successfully
        showSuccessAlert('Password reset email sent!');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        
        // Handle different error codes
        if (error.code === 'auth/invalid-email') {
            console.log('Invalid email address format.');
            resetPassErr.classList.remove('hidden');
            resetPassErrMessage.textContent = 'Invalid email address format.';
        } else if (error.code === 'auth/user-not-found') {
            console.log('No user found with that email address.');
            resetPassErr.classList.remove('hidden');
            resetPassErrMessage.textContent = 'No user found with that email address.';
        } else {
            console.log('Unexpected error:', error.message);
            resetPassErr.classList.remove('hidden');
            resetPassErrMessage.textContent = 'An unexpected error occurred. Please try again.';
        }
    }
}

// Form submit listener
document.getElementById('reset-password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const resetEmail = document.getElementById('reset-email').value.trim().toLowerCase();
    sendPasswordReset(resetEmail);
});
