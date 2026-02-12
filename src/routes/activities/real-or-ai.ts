import { Router } from "express";
import { verifyToken, AuthRequest } from "../../middleware/auth";
import { db } from "../../firebase/admin";

const router = Router();

// POST /activity/real-or-ai/respond
// Body: { imageIndex: number, vote: "real" | "ai" }
router.post("/real-or-ai/respond", verifyToken, async (req: AuthRequest, res) => {
  const { imageIndex, vote } = req.body;
  const userId = req.user.uid;
  const sessionId = "default-session";

  if (typeof imageIndex !== 'number' || !["real", "ai"].includes(vote)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const responseRef = db.collection("sessions").doc(sessionId)
      .collection("activities").doc("real-or-ai")
      .collection("responses").doc(userId)
      .collection("images").doc(imageIndex.toString());

    // Also update main user score - likely needs a transaction or trigger function.
    // For v1 simplicity, we just log the vote. Scoring might be calculated on read or via a background trigger.
    // PRD says "personal score is shown to each participant". So we might need to know the *correctAnswer* to update score immediately?
    // Let's assume we just store the vote here. Score calculation might happen when we "reveal" or fetch results.
    
    await responseRef.set({
      uid: userId,
      vote,
      submittedAt: new Date()
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error saving real-or-ai response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
