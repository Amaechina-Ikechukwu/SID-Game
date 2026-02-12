
import { auth } from "../src/firebase/admin";

const target = process.argv[2];

if (!target) {
  console.error("Usage: bun run scripts/make-admin.ts <email_or_uid>");
  process.exit(1);
}

async function setAdminRole() {
  try {
    let user;
    if (target.includes("@")) {
        console.log(`Looking up user by Email: ${target}...`);
        user = await auth.getUserByEmail(target);
    } else {
        console.log(`Looking up user by UID: ${target}...`);
        user = await auth.getUser(target);
    }
    
    console.log(`User found: ${user.uid} (${user.email})`);
    console.log(`Current claims:`, user.customClaims);

    await auth.setCustomUserClaims(user.uid, { 
      role: "facilitator",
      admin: true
    });

    console.log(`Successfully set 'facilitator' role for ${user.email} (${user.uid})`);
    
    // Verify
    const updatedUser = await auth.getUser(user.uid);
    console.log(`Updated claims:`, updatedUser.customClaims);
    
    process.exit(0);
  } catch (error) {
    console.error("Error setting admin role:", error);
    process.exit(1);
  }
}

setAdminRole();
