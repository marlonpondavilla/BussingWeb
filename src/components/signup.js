import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { firebaseConfig } from '../services/firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firestore Collection
const signedUpUsersCollection = collection(db, 'signedUpUsers');

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const marketing = document.getElementById('marketing');
const terms = document.getElementById('terms');
const submitBtn = document.getElementById('signup-btn');

// Function to add user to Firestore
async function addSignedUpUserToFirestore(signedUpUserData) {
  try {
    const docRef = await addDoc(signedUpUsersCollection, signedUpUserData);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding signup to Firestore: ', e.message, e.code, e.stack);
  }
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

  // Validate email format
  if (!emailPattern.test(userData.email)) {
    alert('Please enter a valid email address');
    return;
  }

  // Password validation: must be at least 6 characters
  if (userData.password.length < 6) {
    alert('Password must be at least 6 characters long');
    return;
  }

  try {
    // Create user with email and password using Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    alert('User signed up successfully. Please verify your email.');

    const user = userCredential.user; // Get the authenticated user object

    // Send email verification to the user
    await sendEmailVerification(user);
    alert('A verification email has been sent to your email address. Please verify your email.');

    // Prepare data to be stored in Firestore
    const signedUpUserToFirestore = {
      uid: user.uid,
      email: user.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      marketing: userData.marketing,
      terms: userData.terms,
    };

    // Insert the user data into Firestore
    await addSignedUpUserToFirestore(signedUpUserToFirestore);
    alert('User added to Firestore');

    // Optionally redirect after successful signup
    // window.location.href = '../index.html';  // Or any page you want to redirect after signup

  } catch (e) {
    console.error('Error signing up user: ', e);
    alert('Error signing up user: ' + e.message);
  }
});
