
import { auth } from "../src/firebase/admin";

const targetEmail = "ikaychina@gmail.com";

async function setAdminRole() {
  try {
    console.log(`Looking up user ${targetEmail}...`);
    const user = await auth.getUserByEmail(targetEmail);
    
    console.log(`User found: ${user.uid}`);
    console.log(`Current claims:`, user.customClaims);

    await auth.setCustomUserClaims(user.uid, { 
      role: "facilitator",
      admin: true // Adding generic admin flag just in case
    });

    console.log(`Successfully set 'facilitator' role for ${targetEmail}`);
    
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
