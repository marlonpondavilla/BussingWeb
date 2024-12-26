import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { firebaseConfig } from '../services/firebaseConfig.js';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const usersCollection = collection(db, 'users');
const signedUpUsersCollection = collection(db, 'signedUpUsers');

// Function to add user to Firestore
export async function addUserToFirestore(userData) {
    try {
        const docRef = await addDoc(usersCollection, userData);
        console.log('Document written with ID: ', docRef.id);
    } catch (e) {
        console.error('Error adding google user: ', e);
    }
}

// Function to add signed up user to Firestore
export async function addSignedUpUserToFirestore(signedUpUserData) {
    try{
        const docRef = await addDoc(signedUpUsersCollection, signedUpUserData);
        console.log('Document written with ID: ', docRef.id);
    } catch(e){
        console.error('Error adding signup: ', e);
    }
}