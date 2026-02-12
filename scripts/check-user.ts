
import { auth } from "../src/firebase/admin";

const targetUid = process.argv[2];

if (!targetUid) {
  console.error("Usage: bun run scripts/check-user.ts <uid>");
  process.exit(1);
}

async function checkUser() {
  try {
    console.log(`Looking up user by UID: ${targetUid}...`);
    const user = await auth.getUser(targetUid);
    
    console.log(`User found!`);
    console.log(`Email: ${user.email}`);
    console.log(`Display Name: ${user.displayName}`);
    console.log(`Custom Claims:`, user.customClaims);
    console.log(`Project ID: ${process.env.GOOGLE_CLOUD_PROJECT || 'unknown'}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error looking up user:", error);
    process.exit(1);
  }
}

checkUser();
