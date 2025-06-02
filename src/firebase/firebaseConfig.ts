// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsQQlIkI7ywckG6wHgIFpO-I8dYEvUmJ8",
  authDomain: "diri-gestor-eventos.firebaseapp.com",
  projectId: "diri-gestor-eventos",
  storageBucket: "diri-gestor-eventos.firebasestorage.app",
  messagingSenderId: "538431860882",
  appId: "1:538431860882:web:d0c536e349992987ddb64b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);