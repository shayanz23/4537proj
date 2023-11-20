import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import { collection, getFirestore, getDocs } from "firebase/firestore";
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { BrowserRouter } from "react-router-dom";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAzrwmTIvyaxoLwAs51HbCecC6CdIDpF0E",

  authDomain: "project-2453872724550098648.firebaseapp.com",

  projectId: "project-2453872724550098648",

  storageBucket: "project-2453872724550098648.appspot.com",

  messagingSenderId: "419663793027",

  appId: "1:419663793027:web:dbb8f1c4b7a1040314c4b6",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);


const db = getFirestore(app);
console.log(db);
const colRef = collection(db, "users");
console.log(colRef);
// let list: any[] = await getDocs(colRef).
// console.log(list);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />

      
    </BrowserRouter>
  </React.StrictMode>
);
