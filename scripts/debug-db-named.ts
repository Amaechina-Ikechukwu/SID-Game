
import { db } from "../src/firebase/admin";

async function testNamedDb() {
  try {
    console.log("Attempting to write to 'sid-4t4' database...");
    const ref = db.collection("test").doc("ping");
    await ref.set({
      message: "Hello from sid-4t4",
      timestamp: new Date()
    });
    console.log("Successfully wrote to 'sid-4t4'!");
    
    const doc = await ref.get();
    console.log("Read back data:", doc.data());
  } catch (error) {
    console.error("Failed to access 'sid-4t4':", error);
  }
}

testNamedDb();
