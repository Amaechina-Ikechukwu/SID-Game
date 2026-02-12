import { Router } from "express";
import { verifyToken, AuthRequest } from "../../middleware/auth";
import { db } from "../../firebase/admin";

const router = Router();

// POST /activity/verdict-vote/respond
// Body: { caseIndex: number, verdict: string, confidence: number }
router.post("/verdict-vote/respond", verifyToken, async (req: AuthRequest, res) => {
  const { caseIndex, verdict, confidence } = req.body;
  const userId = req.user.uid;
  const sessionId = "default-session";

  // Validate inputs
  const currentCaseIndex = typeof caseIndex === 'number' ? caseIndex : 0;
  
  if (!verdict || typeof confidence !== 'number' || confidence < 1 || confidence > 5) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const responseRef = db.collection("sessions").doc(sessionId)
      .collection("activities").doc("verdict-vote")
      .collection("responses").doc(userId)
      .collection("cases").doc(currentCaseIndex.toString());

    await responseRef.set({
      uid: userId,
      name: req.user.name || "Anonymous",
      submittedAt: new Date(),
      verdict,
      confidence
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error saving verdict vote response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
