// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATzvC0QIqvaOly_MqRF7AMBIIdih9FvyM",
  authDomain: "learningresourcemgm.firebaseapp.com",
  projectId: "learningresourcemgm",
  storageBucket: "learningresourcemgm.appspot.com",
  messagingSenderId: "306252285010",
  appId: "1:306252285010:web:5e153f7449ed950d824b8b",
  measurementId: "G-8KYM3Q5475"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;