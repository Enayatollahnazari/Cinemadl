// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC45gz-4c1291AYxluEr1Ces3XfTGwCt7Q",
  authDomain: "mysite-c28a2.firebaseapp.com",
  projectId: "mysite-c28a2",
  storageBucket: "mysite-c28a2.appspot.com",
  messagingSenderId: "96470005461",
  appId: "1:96470005461:web:d82d0a08ee127ccc55d45c",
  measurementId: "G-724VWR84FD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };