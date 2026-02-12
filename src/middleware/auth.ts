import { Request, Response, NextFunction } from "express";
import { auth } from "../firebase/admin";

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const sessionCookie = req.cookies?.session || "";

  if (!sessionCookie) {
    return res.redirect("/auth/login");
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    req.user = decodedClaims;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.clearCookie("session");
    res.redirect("/auth/login");
  }
};

export const verifyFacilitator = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "facilitator") {
    next();
  } else {
    res.status(403).send("Access denied: Facilitators only.");
  }
};
