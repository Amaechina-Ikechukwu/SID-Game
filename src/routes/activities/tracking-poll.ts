import { Router } from "express";
import { verifyToken, AuthRequest } from "../../middleware/auth";
import { db } from "../../firebase/admin";

const router = Router();

// POST /activity/tracking-poll/respond
// Body: { option: string }
router.post("/tracking-poll/respond", verifyToken, async (req: AuthRequest, res) => {
  const { option } = req.body; // e.g., "delete", "settings", "ignore", "report"
  const userId = req.user.uid;
  const sessionId = "default-session";

  const VALID_OPTIONS = ["delete", "settings", "ignore", "report"];

  if (!VALID_OPTIONS.includes(option)) {
    return res.status(400).json({ error: "Invalid option" });
  }

  try {
    const responseRef = db.collection("sessions").doc(sessionId)
      .collection("activities").doc("tracking-poll")
      .collection("responses").doc(userId);

    await responseRef.set({
      uid: userId,
      name: req.user.name || "Anonymous",
      submittedAt: new Date(),
      option
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error saving tracking poll response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
