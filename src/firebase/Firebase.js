// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_API_KEY}`,
  authDomain: "learningresourcemgm.firebaseapp.com",
  projectId: "learningresourcemgm",
  storageBucket: "learningresourcemgm.appspot.com",
  messagingSenderId: "306252285010",
  appId: "1:306252285010:web:5e153f7449ed950d824b8b",
  measurementId: "G-8KYM3Q5475"
};

console.log(firebaseConfig);
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;