import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { firebaseConfig } from '../services/firebaseConfig.js';
import { addDataToFirestore } from '../firebase/db.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const marketing = document.getElementById('marketing');
const terms = document.getElementById('terms');
const submitBtn = document.getElementById('signup-btn');

const errMsg = document.getElementById('error-msg');
const errEmail = document.getElementById('error-email-msg');
const errPassword = document.getElementById('error-psw-msg');

function removeInputValues(){
  firstName.value = '';
  lastName.value = '';
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
  marketing.checked = false;
  terms.checked = false;
}

// Email validation pattern
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  // Prepare user data from the form
  const userData = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    marketing: marketing.checked,
    terms: terms.checked,
  };

  // Validate input fields
  if (firstName.value === '' || lastName.value === '' || email.value === '' || password.value === '' || confirmPassword.value === '') {
    errMsg.classList.remove('hidden');
    firstName.classList.add('border-red-500');
    lastName.classList.add('border-red-500');
    email.classList.add('border-red-500');
    password.classList.add('border-red-500');
    confirmPassword.classList.add('border-red-500');
    return;
  } else {
    password.classList.remove('border-red-500');
    confirmPassword.classList.remove('border-red-500');
    errPassword.classList.add('hidden');
    errEmail.classList.add('hidden');
    errMsg.classList.add('hidden');
  }

  // Validate email format
  if (!emailPattern.test(userData.email)) {
    errEmail.classList.remove('hidden');
    return;
  }

  // Validate password length
  if (userData.password.length < 6) {
    errPassword.classList.remove('hidden');
    return;
  }

  // Password match validation
  if (password.value !== confirmPassword.value) {
    errPassword.textContent = 'Passwords do not match';
    password.classList.add('border-red-500');
    confirmPassword.classList.add('border-red-500');
    errPassword.classList.remove('hidden');
    return;
  }

  try {
    // Create user with email and password using Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    alert('User signed up successfully');

    // Get the authenticated user object
    const user = userCredential.user; 

    // Set display name for the user 
    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`,
    });

    // Prepare data to be stored in Firestore
    const signedUpUserToFirestore = {
      uid: user.uid,
      email: user.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      marketing: userData.marketing,
      terms: userData.terms,
      isAdmin: false,
      timeCreated: new Date(),
    };

    // Insert the user data into Firestore
    await addDataToFirestore('SignedUpUserCollection',signedUpUserToFirestore);
    removeInputValues();

  } catch (error) {
    // check email existence
    if(error.code === 'auth/email-already-in-use'){
      errEmail.classList.remove('hidden');
      errEmail.textContent = 'Email already exist in our system';
      email.classList.add('border-red-500');
    }
    console.error('Error signing up user: ', error);
  }
});

// Clear the email error message when the email input is changed
email.addEventListener('input', () => {
  if (errEmail.classList.contains('hidden') === false) {
    errEmail.classList.add('hidden');
    email.classList.remove('border-red-500');
  }
});
