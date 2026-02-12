import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD2GAl1HkpnV0mujt3j63OtW9MoWj7dY6Q",
  authDomain: "musterus-api.firebaseapp.com",
  projectId: "musterus-api",
  storageBucket: "musterus-api.appspot.com",
  messagingSenderId: "286455810620",
  appId: "1:286455810620:web:4c99980b809ac7dabdd139"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "sid-4t4");

console.log(">> DB_CONNECTION_ESTABLISHED: sid-4t4");

export { db, doc, onSnapshot, collection };
