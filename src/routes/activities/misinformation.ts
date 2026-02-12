import { Router } from "express";
import { verifyToken, AuthRequest } from "../../middleware/auth";
import { db } from "../../firebase/admin";

const router = Router();

// POST /activity/misinformation/respond
// Body: { share: boolean, reasons: string[] }
router.post("/misinformation/respond", verifyToken, async (req: AuthRequest, res) => {
  const { share, reasons } = req.body;
  const userId = req.user.uid;
  const sessionId = "default-session";

  if (typeof share !== 'boolean' || !Array.isArray(reasons)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const responseRef = db.collection("sessions").doc(sessionId)
      .collection("activities").doc("misinformation")
      .collection("responses").doc(userId);

    await responseRef.set({
      uid: userId,
      name: req.user.name || "Anonymous",
      submittedAt: new Date(),
      share,
      reasons
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error saving misinformation response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
