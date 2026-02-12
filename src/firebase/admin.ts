import admin from "firebase-admin";

// Ensure environment variables are loaded if not using Bun's auto-load
import * as dotenv from "dotenv";
dotenv.config();

if (!admin.apps.length) {
  try {
    let credential;
    
    // In production (Cloud Run), use Application Default Credentials
    // In local dev, use service account file if provided
    if (process.env.NODE_ENV === 'production') {
        console.log("Production mode: using Application Default Credentials");
        credential = admin.credential.applicationDefault();
    } else {
        const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./service-account.json";
        console.log(`Development mode: loading credentials from ${serviceAccountPath}`);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const serviceAccount = require(serviceAccountPath);
        credential = admin.credential.cert(serviceAccount);
    }

    admin.initializeApp({
      credential: credential,
      databaseURL: "https://sid-289e0.firebaseio.com/"
    });
    console.log("Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
    process.exit(1); // Exit if critical dependency fails
  }
}


// Use explicit types to avoid portability issues
// Attempt to connect to named database 'sid-4t4' as requested
import { getFirestore } from "firebase-admin/firestore";

// Log which database we are connecting to
console.log(">> INITIALIZING_DATABASE_CONNECTION: sid-4t4");

export const auth: admin.auth.Auth = admin.auth();
export const db = getFirestore(admin.app(), "sid-4t4");

