import { Router } from "express";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Apply auth middleware to all participant routes
router.use(verifyToken);

// GET /lobby
router.get("/lobby", (req: any, res) => {
  res.render("participant/lobby", { user: req.user });
});

// GET /activity/:id
router.get("/activity/:id", (req: any, res) => {
  const activityId = req.params.id;
  // TODO: Fetch activity details from Firestore
  res.render("participant/activity", { user: req.user, activityId });
});

export default router;
