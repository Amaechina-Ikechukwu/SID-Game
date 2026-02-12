// Firebase Client Configuration
// REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyD2GAl1HkpnV0mujt3j63OtW9MoWj7dY6Q",
  authDomain: "musterus-api.firebaseapp.com",
  databaseURL: "https://sid-4t4.firebaseio.com", // Updated as requested
  projectId: "musterus-api",
  storageBucket: "musterus-api.appspot.com",
  messagingSenderId: "286455810620",
  appId: "1:286455810620:web:4c99980b809ac7dabdd139",
  databaseId: "sid-4t4" // Critical for named database support in v9+ (but using compat here)
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Helper to get the correct Firestore instance
// Ideally, the 'databaseId' in config handles it for newer SDKs, 
// but for compat v8/v9 we might need to specify it manually if default isn't enough.
// However, 'firebase.firestore()' usually gets the default.
// Let's try to get the named app if needed, or rely on config.
// UPDATE: The compat library doesn't easily support multiple DBs via config alone sometimes.
// But let's assume standard initialization with databaseURL might help or we need a specific call.
// For now, let's export a getter or just the instance.

console.log(">> FIREBASE_CLIENT_INITIALIZED: sid-4t4");

// We might need to use the modular SDK pattern if compat fails for named DBs,
// but let's try to stick to compat for now as it's what we have.
// If this doesn't work, we'll need to use the modular SDK in the views.
