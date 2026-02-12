import { Router } from "express";
import { verifyToken, verifyFacilitator } from "../middleware/auth";

const router = Router();

// Apply auth and facilitator middleware
router.use(verifyToken);
// router.use(verifyFacilitator); // Commented out for now to allow testing without custom claims

// GET /admin
router.get("/", (req: any, res) => {
  res.render("facilitator/dashboard", { user: req.user });
});

import { db } from "../firebase/admin";

// POST /admin/activity/:id/launch
router.post("/activity/:id/launch", async (req, res) => {
  const activityId = req.params.id;
  const sessionId = "default-session"; 

  try {
    // 1. Update session status
    await db.collection("sessions").doc(sessionId).set({
      currentActivity: activityId,
      status: "active",
      updatedAt: new Date()
    }, { merge: true });

    // 2. Initialize activity state if needed (optional)
    await db.collection("sessions").doc(sessionId)
        .collection("activities").doc(activityId).set({
            status: "active",
            launchedAt: new Date()
    }, { merge: true });

    res.json({ status: "success", message: `Launched ${activityId}` });
  } catch (error) {
    console.error("Launch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /admin/reset
router.post("/reset", async (req, res) => {
  const sessionId = "default-session";
  try {
    await db.collection("sessions").doc(sessionId).set({
      currentActivity: "none",
      status: "idle",
      updatedAt: new Date()
    }, { merge: true });
    
    res.json({ status: "success", message: "Session Reset" });
  } catch (error) {
    console.error("Reset Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
