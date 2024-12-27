import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore, collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { firebaseConfig } from '../services/firebaseConfig.js';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const usersCollection = collection(db, 'users');  // Reference to the users collection

// Function to add user to Firestore with their UID
export async function addUserToFirestore(userData) {
    try {
        // Get the user document reference using the user's UID
        const userDocRef = doc(db, 'users', userData.uid); 

        // Use setDoc() to create or overwrite the user document
        await setDoc(userDocRef, userData);

        console.log('Google account has been logged in: ', userData.uid);
    } catch (e) {
        console.error('Error adding google user: ', e);
    }
}

// Function to add signed up user to Firestore (similar to the addUserToFirestore function)
export async function addSignedUpUserToFirestore(signedUpUserData) {
    try {
        const docRef = await setDoc(doc(db, 'signedUpUsers', signedUpUserData.uid), signedUpUserData);
        console.log('Customized user has been signed up: ', docRef.id);
    } catch (e) {
        console.error('Error adding signup: ', e);
    }
}
