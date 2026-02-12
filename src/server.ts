import express from "express";
import { join } from "path";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "../public")));

// SERVE REACT FRONTEND (Production Mode)
// Serve built React files from client/dist
const clientDistPath = join(process.cwd(), "client/dist");
console.log(`[SERVER] Serving static files from: ${clientDistPath}`);
app.use(express.static(clientDistPath, { fallthrough: true }));

// API Routes
import authRoutes from "./routes/auth";
import participantRoutes from "./routes/participant";
import facilitatorRoutes from "./routes/facilitator";

// Routes
app.use("/auth", authRoutes);
app.use("/admin", facilitatorRoutes);
// app.use("/", participantRoutes); // Disable legacy EJS routes for now

import passwordPollRoutes from "./routes/activities/password-poll";
import phishingRoutes from "./routes/activities/phishing";
import trackingPollRoutes from "./routes/activities/tracking-poll";
import realOrAiRoutes from "./routes/activities/real-or-ai";
import misinformationRoutes from "./routes/activities/misinformation";
import verdictVoteRoutes from "./routes/activities/verdict-vote";

app.use("/auth", authRoutes);
app.use("/", participantRoutes); 
app.use("/activity", passwordPollRoutes); 
app.use("/activity", phishingRoutes);
app.use("/activity", trackingPollRoutes);
app.use("/activity", realOrAiRoutes);
app.use("/activity", misinformationRoutes);
app.use("/activity", verdictVoteRoutes);
app.use("/admin", facilitatorRoutes);

// Projector Route (can be separate file later if complex)
// React SPA Fallback
app.get("*", (req: any, res: any, next: any) => {
  if (req.path.startsWith("/auth") || req.path.startsWith("/admin") || req.path.startsWith("/api") || req.path.startsWith("/activity")) {
    return next();
  }
  const indexPath = join(process.cwd(), "client/dist/index.html");
  console.log(`[SERVER] Serving SPA fallback: ${indexPath}`);
  res.sendFile(indexPath, (err: any) => {
    if (err) {
      console.error("[SERVER] Error serving index.html:", err);
      res.status(500).send("Frontend files not found. Please rebuild the client.");
    }
  });
});

// app.get("/", (req, res) => {
//   res.redirect("/auth/login");
// });

app.listen(port, () => {
    console.log(`SID2026 server running on http://localhost:${port}`);
});

