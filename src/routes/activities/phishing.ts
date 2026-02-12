import { Router } from "express";
import { verifyToken, AuthRequest } from "../../middleware/auth";
import { db } from "../../firebase/admin";

const router = Router();

// POST /activity/phishing/respond
// Body: { choice: "A" | "B", redFlags: string[] }
router.post("/phishing/respond", verifyToken, async (req: AuthRequest, res) => {
  const { choice, redFlags } = req.body;
  const userId = req.user.uid;
  const sessionId = "default-session";

  if (!["A", "B"].includes(choice) || !Array.isArray(redFlags)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const responseRef = db.collection("sessions").doc(sessionId)
      .collection("activities").doc("phishing")
      .collection("responses").doc(userId);

    await responseRef.set({
      uid: userId,
      name: req.user.name || "Anonymous",
      submittedAt: new Date(),
      choice,
      redFlags
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error saving phishing response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
