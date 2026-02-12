import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2GAl1HkpnV0mujt3j63OtW9MoWj7dY6Q",
  authDomain: "musterus-api.firebaseapp.com",
  projectId: "musterus-api",
  storageBucket: "musterus-api.appspot.com",
  messagingSenderId: "286455810620",
  appId: "1:286455810620:web:4c99980b809ac7dabdd139"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "sid-4t4"); // Connect to named database
const auth = getAuth(app);

console.log(">> FIREBASE_CLIENT_INIT: sid-4t4");

export { db, auth, collection, doc, onSnapshot };
