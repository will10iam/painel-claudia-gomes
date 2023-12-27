import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAkRD1NdMBGPIOX8x3IAmS-LoU4vCHnat0",
    authDomain: "claudia-e9640.firebaseapp.com",
    projectId: "claudia-e9640",
    storageBucket: "claudia-e9640.appspot.com",
    messagingSenderId: "653176793549",
    appId: "1:653176793549:web:69ffa4f05670d377d6bc84",
    measurementId: "G-LZZM58WMC6"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };
