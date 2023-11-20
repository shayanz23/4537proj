// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzrwmTIvyaxoLwAs51HbCecC6CdIDpF0E",
  authDomain: "project-2453872724550098648.firebaseapp.com",
  projectId: "project-2453872724550098648",
  storageBucket: "project-2453872724550098648.appspot.com",
  messagingSenderId: "419663793027",
  appId: "1:419663793027:web:dbb8f1c4b7a1040314c4b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;