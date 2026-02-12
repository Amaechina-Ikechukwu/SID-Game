import { Router } from "express";
import { auth } from "../firebase/admin";

const router = Router();

// GET /auth/login
router.get("/login", (req, res) => {
  res.render("auth/login", { error: null });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { idToken } = req.body;
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    const options = { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === "production" };
    res.cookie("session", sessionCookie, options);
    res.json({ status: "success" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(401).json({ status: "error", message: "Unauthorized" });
  }
});

// GET /auth/register
router.get("/register", (req, res) => {
  res.render("auth/register", { error: null });
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/auth/login");
});

export default router;
