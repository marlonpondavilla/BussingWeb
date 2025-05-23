import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, where, query, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { firebaseConfig } from '../services/firebaseConfig.js';
import { getDatabase, ref, get, child } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// add data to Firestore
export async function addDataToFirestore(collectionName, scheduleData) {
    try {
        const docRef = await addDoc(collection(db, collectionName), scheduleData);
        return;
    } catch (e) {
        console.error('Error adding Data to Firestore: ', e);
    }
}

// function to retrieve data from Firestore
export async function getFirestoreData(collectionName) {
    try {
        const snapshot = await getDocs(collection(db, collectionName));
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => doc.data());
    } catch (e) {
        console.error('Error getting documents: ', e);
    }
}

export async function getAllFirestoreDocumentById(field, value, collectionName) {
    try {
        const q = query(collection(db, collectionName), where(field, '==', value));

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        }

        return snapshot.docs.map(doc => doc.data());
    } catch (e) {
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

export async function getSingleFirestoreDocument(field, value, collectionName) {
    try {
        // Dynamically create the query based on the field and value
        const q = query(collection(db, collectionName), where(field, '==', value));
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


export async function updateSingleFirestoreData(busNo, collectionName, updatedData) {
    try {
        // query to find the document where busNo matches the provided busNo
        const q = query(collection(db, collectionName), where('busNo', '==', busNo));

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return;
        }

        const docRef = doc(db, collectionName, snapshot.docs[0].id)
        await updateDoc(docRef, updatedData);
        return;

    } catch (e) {
        console.error('Error updating document: ', e);
    }
}

// delete specific document from Firestore
export async function deleteSingleFirestoreData(busNo, collectionName) {
    try {
        const q = query(collection(db, collectionName), where('busNo', '==', busNo));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.error('No matching delete document');
            return;
        }

        const documentId = snapshot.docs[0].id;

        const docRef = doc(db, collectionName, documentId);

        await deleteDoc(docRef);
    } catch (e) {
        console.error('Error deleting document: ', e);
    }
}

export async function deleteSingleFirestoreDocument(field, value, collectionName) {
    try {
        const q = query(collection(db, collectionName), where(field, '==', value));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.error('No matching delete document');
            return;
        }

        const documentId = snapshot.docs[0].id;

        const docRef = doc(db, collectionName, documentId);

        await deleteDoc(docRef);
    } catch (e) {
        console.error('Error deleting document: ', e);
    }
}

export async function getSearchTerm(field, searchTerm, collectionName) {
    try {
        const collRef = collection(db, collectionName);
        const q = query(
            collRef,
            where(field, '>=', searchTerm),
            where(field, '<=', searchTerm + '\uf8ff')
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }

        const results = [];
        querySnapshot.forEach((doc) => {
            results.push(doc.data());
        });

        return results;
    } catch (error) {
        console.error('Error querying Firestore:', error);
        return null;
    }
}

export async function getCollectionSize(collectionName) {
    try {
        const snapshot = await getDocs(collection(db, collectionName));

        if (snapshot.empty) {
            return 0;
        }

        return snapshot.size;
    } catch (e) {
        console.error('Error getting ticket sold size: ', e);
    }
}

export async function getCollectionSizeRDB(path) {
    try {
        const db = getDatabase();
        const dbRef = ref(db);

        const snapshot = await get(child(dbRef, path));
        if (!snapshot.exists()) {
            return 0;
        }

        const data = snapshot.val();
        return Object.keys(data).length;
    } catch (e) {
        console.error("Error getting collection size from RDB:", e);
    }
}

export async function getRDBUsers(path) {
    try {
        const db = getDatabase();
        const snapshot = await get(child(ref(db), path));

        if (!snapshot.exists()) {
            return [];
        }

        const data = snapshot.val();

        return Object.entries(data).map(([key, value]) => ({
            id: key,
            email: value.email || null,
            createdAt: value.createdAt || null
        }));
    } catch (e) {
        console.error('Error getting RDB data:', e);
    }
}






