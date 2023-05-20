import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBnfFb289exDcl2X2J0aeh8yC9RYcqKpp4",
    authDomain: "arara-75f21.firebaseapp.com",
    projectId: "arara-75f21",
    storageBucket: "arara-75f21.appspot.com",
    messagingSenderId: "70442684285",
    appId: "1:70442684285:web:774901fdcd5fb7f75d8614",
    measurementId: "G-93PNNEW1HR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);