import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBax2WKSy4JZfCT75NLGb2Aj03ibiGAREI",
    authDomain: "autismcare-deef8.firebaseapp.com",
    projectId: "autismcare-deef8",
    storageBucket: "autismcare-deef8.firebasestorage.app",
    messagingSenderId: "702574842049",
    appId: "1:702574842049:web:79323cc224ce16c7b8c440",
    measurementId: "G-5C3HCQ54J5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };