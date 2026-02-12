import { Router } from "express";
import { verifyToken, verifyFacilitator, AuthRequest } from "../../middleware/auth";
import { db } from "../../firebase/admin";

const router = Router();

// Define steps for the poll
const POLL_QUESTIONS = [
  "Do you use the same password for more than one account?",
  "Does any of your passwords contain your name or birthday?",
  "Have you changed any of your passwords in the last 6 months?"
];

// POST /activity/password-poll/respond
// Participant submits an answer.
// Body: { step: number, answer: "yes" | "no" }
router.post("/password-poll/respond", verifyToken, async (req: AuthRequest, res) => {
  const { step, answer } = req.body;
  const userId = req.user.uid;
  const sessionId = "default-session"; // TODO: Manage sessions dynamically

  if (typeof step !== 'number' || !["yes", "no"].includes(answer)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const responseRef = db.collection("sessions").doc(sessionId)
      .collection("activities").doc("password-poll")
      .collection("responses").doc(userId);

    // Update the response for the specific step
    // We store it as a map: { "q0": "yes", "q1": "no", ... }
    await responseRef.set({
      uid: userId,
      name: req.user.name || "Anonymous",
      submittedAt: new Date(),
      [`q${step}`]: answer
    }, { merge: true });

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Facilitator endpoints would go here (launch, next step, reveal)
// For brevity, we might handle them in the main facilitator router or here.
// Let's add specific ones here for this activity module if needed, 
// or keep them generic in facilitator.ts if the pattern is identical.

export default router;
