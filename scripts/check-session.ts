
import { db } from "../src/firebase/admin";

async function checkSession() {
  try {
    const doc = await db.collection("sessions").doc("default-session").get();
    if (doc.exists) {
      console.log("Session Data:", JSON.stringify(doc.data(), null, 2));
    } else {
      console.log("Session document 'default-session' does not exist.");
    }
  } catch (error) {
    console.error("Error checking session:", error);
  }
}

checkSession();
