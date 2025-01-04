import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, where, query, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { firebaseConfig } from '../services/firebaseConfig.js';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// add data to Firestore
export async function addDataToFirestore(collectionName, scheduleData){
    try{
        const docRef = await addDoc(collection(db, collectionName), scheduleData);
    } catch(e){
        console.error('Error adding Data to Firestore: ', e);
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

// Function to check if busNo already exists
export async function checkBusNumberExists(busNo, collectionName) {
    try {
        const q = query(collection(db, collectionName), where('busNo', '==', busNo));
        const snapshot = await getDocs(q);

        // Return true if busNo already exists
        return !snapshot.empty;
    } catch (e) {
        console.error('Error checking busNo: ', e);
        return false;
    }
}   

// get a single document from Firestore where the document's busNo field matches the provided busNo
export async function getSingleFirestoreData(busNo, collectionName) {
    try {

        const q = query(collection(db, collectionName), where('busNo', '==', busNo));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;  
        }

        return snapshot.docs[0].data();

    } catch (e) {
        console.error('Error getting document: ', e);
        return null; 
    }
}

export async function updateSingleFirestoreData(busNo, collectionName, updatedData){
    try{
        // query to find the document where busNo matches the provided busNo
        const q = query(collection(db, collectionName ), where('busNo', '==', busNo));

        const snapshot = await getDocs(q);

        if(snapshot.empty){
            return;
        }

        const docRef = doc(db, collectionName, snapshot.docs[0].id)
        await updateDoc(docRef, updatedData);
        
    } catch(e){
        console.error('Error updating document: ', e);
    }
}

// delete specific document from Firestore
export async function deleteSingleFirestoreData(busNo, collectionName){
    try{
        const q = query(collection(db, collectionName), where('busNo', '==', busNo));
        const snapshot = await getDocs(q);

        if(snapshot.empty){
            console.error('No matching delete document');
            return;
        }

        const documentId = snapshot.docs[0].id;

        const docRef = doc(db, collectionName, documentId);

        await deleteDoc(docRef);    
    } catch(e){
        console.error('Error deleting document: ', e);
    }
}



