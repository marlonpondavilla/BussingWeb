import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { firebaseConfig } from '../services/firebaseConfig.js';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const usersCollection = collection(db, 'userLoggedIn');
const signedUpUsersCollection = collection(db, 'signedUpUsers');
const adminLoggedInCollection = collection(db, 'adminLoggedIn');
const scheduleCollection = collection(db, 'ScheduleDocuments');

// Function to add user to Firestore
export async function addUserToFirestore(userData) {
    try {
        const docRef = await addDoc(usersCollection, userData);
    } catch (e) {
        console.error('Error adding google user: ', e);
    }
}

// Function to add signed up user to Firestore
export async function addSignedUpUserToFirestore(signedUpUserData) {
    try{
        const docRef = await addDoc(signedUpUsersCollection, signedUpUserData);
    } catch(e){
        console.error('Error adding signup: ', e);
    }
}

// Function to add admin to Firestore
export async function addAdminToFirestore(adminData){
    try{
        const docRef = await addDoc(adminLoggedInCollection, adminData);
    } catch(e){
        console.error('Error adding admin: ', e);
    }
}

// add schedule to Firestore
export async function addScheduleToFirestore(scheduleData){
    try{
        const docRef = await addDoc(scheduleCollection, scheduleData);
    } catch(e){
        console.error('Error adding schedule: ', e);
    }
}

// function to retrieve data from Firestore
export async function getFirestoreData(collectionName) {
    try{
        const snapshot = await getDocs(collection(db, collectionName));
        if(snapshot.empty){
            return [];
        }
        return snapshot.docs.map(doc => doc.data());
    } catch(e){
        console.error('Error getting documents: ', e);
    }
}
