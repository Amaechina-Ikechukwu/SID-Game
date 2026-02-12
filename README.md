# SID2026 Interactive Activities Platform

**Safer Internet Day 2026** — Live interactive web platform for audience participation  
**Event:** February 13, 2026 | Rad5 Tech Hub × Internet Society Nigeria Chapter

---

## 📋 Overview

A real-time, mobile-first platform built for the Safer Internet Day 2026 event at Rad5 Tech Hub in Aba, Nigeria. Transforms six cybersecurity education activities into live, gamified experiences where every participant can respond simultaneously on their phones while results display in real-time on the projector.

**Stack:**
- **Runtime:** Bun.js (JavaScript/TypeScript)
- **Backend:** Express.js REST API
- **Frontend:** React 19 + TypeScript + Vite
- **Database:** Firebase Firestore (real-time)
- **Auth:** Firebase Authentication
- **Charts:** Recharts
- **Deployment:** Google Cloud Run (Docker)

---

## 🎯 Features

### Six Interactive Activities

1. **🔐 Password Hygiene Poll** — 3-question yes/no poll about password practices
2. **🔍 Spot the Fake** — Identify phishing emails and red flags
3. **📱 App Tracking Poll** — Choose your response to tracking scenarios
4. **🖼️ Real or AI?** — Vote on 6 image pairs (real photos vs AI-generated)
5. **📰 Headline Check** — Would you share this news? Why/why not?
6. **⚖️ The Verdict** — Case study voting with confidence rating

### Core Functionality

- **Participant Experience:** QR code login → lobby → join live activities → submit responses
- **Facilitator Dashboard:** Launch activities, advance rounds (Real or AI), reveal results, export data
- **Projector Display:** Fullscreen view with live charts (bar, donut, grouped bar), activity content panels
- **Real-time Sync:** All participants see the current activity via Firestore listeners
- **Auto-navigation:** Participants automatically redirect when facilitator changes activities

---

## 🗂️ Project Structure

```
SID/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx        # Firebase Auth login
│   │   │   ├── Lobby.tsx        # Waiting room for participants
│   │   │   ├── Activity.tsx     # Activity router/wrapper
│   │   │   ├── Dashboard.tsx    # Facilitator control panel
│   │   │   └── Projector.tsx    # Fullscreen projector display
│   │   ├── components/
│   │   │   ├── activities/      # 6 activity modules
│   │   │   │   ├── PasswordPoll.tsx
│   │   │   │   ├── Phishing.tsx
│   │   │   │   ├── TrackingPoll.tsx
│   │   │   │   ├── RealOrAi.tsx
│   │   │   │   ├── Misinformation.tsx
│   │   │   │   └── VerdictVote.tsx
│   │   │   ├── projector/
│   │   │   │   ├── ResultsView.tsx      # Chart data processing
│   │   │   │   └── ProjectorCharts.tsx  # Recharts components
│   │   │   └── Navigation.tsx
│   │   ├── context/             # React Context providers
│   │   │   ├── AuthContext.tsx  # Firebase auth state
│   │   │   ├── GameContext.tsx  # Session state (currentActivity, imageIndex)
│   │   │   └── ToastContext.tsx # Notifications
│   │   ├── lib/
│   │   │   └── firebase.ts      # Firebase client config
│   │   ├── App.tsx              # Router + auth guards
│   │   └── main.tsx
│   ├── public/
│   │   └── Images/              # 6 real + 6 fake images for Real or AI
│   │       ├── real1.jpeg → real6.jpeg
│   │       └── fake1.jpeg → fake6.jpeg
│   ├── package.json
│   └── vite.config.ts
│
├── src/                         # Express backend
│   ├── server.ts                # Main entry point
│   ├── firebase/
│   │   └── admin.ts             # Firebase Admin SDK init
│   ├── routes/
│   │   ├── auth.ts              # Auth endpoints (legacy)
│   │   ├── facilitator.ts       # Facilitator endpoints (legacy)
│   │   └── activities/          # Activity-specific routes (legacy EJS)
│   └── views/                   # EJS templates (legacy, not used in React SPA)
│
├── scripts/                     # Admin utilities
│   ├── set-admin.ts             # Assign facilitator role to user
│   └── check-session.ts         # Inspect Firestore session doc
│
├── public/                      # Static assets (legacy)
├── Dockerfile                   # Multi-stage build for Cloud Run
├── .dockerignore
├── firestore.rules              # Firestore security rules
├── service-account.json         # Firebase service account (DO NOT COMMIT)
├── .env                         # Environment variables (local dev)
├── package.json                 # Backend dependencies
├── tsconfig.json
└── SID2026_PRD.md               # Full product requirements doc
```

---

## 🚀 Local Development Setup

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- Node.js v20+ (for tooling compatibility)
- Firebase project with Firestore and Authentication enabled
- Firebase service account JSON file

### 1. Clone and Install

```bash
git clone <repo-url>
cd SID
bun install
cd client && bun install && cd ..
```

### 2. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firebase Authentication** (Email/Password)
3. Enable **Firestore Database** (create a named database: `sid-4t4`)
4. Download **service account JSON** → save as `service-account.json` in project root
5. Get **Firebase client config** → update `client/src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Environment Variables

Create `.env` in project root:

```env
PORT=3001
NODE_ENV=development
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

### 4. Firestore Structure

The app expects this structure:

```
sessions/
  └── default-session/
        ├── currentActivity: "none" | "password-poll" | "phishing" | ...
        ├── status: "idle" | "active" | "revealing" | "closed"
        ├── imageIndex: 0-5 (for real-or-ai)
        └── activities/
              ├── password-poll/
              │     └── responses/{userId}
              ├── phishing/
              │     └── responses/{userId}
              └── ... (6 total activities)
```

**Initialize session doc manually:**

```bash
bun run scripts/check-session.ts  # Check current state
# Or create manually in Firebase Console
```

### 5. Create Admin User

```bash
# Create user via Firebase Console or signup flow
# Then run:
bun run scripts/set-admin.ts <user-email>
```

### 6. Add Images (Real or AI Activity)

Place images in `client/public/Images/`:
- `real1.jpeg` through `real6.jpeg`
- `fake1.jpeg` through `fake6.jpeg`

### 7. Run Development Servers

**Terminal 1 — Backend:**
```bash
bun run dev
# Server: http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd client
bun run dev
# Vite dev server: http://localhost:5173
```

**Access:**
- Participants: http://localhost:5173/lobby
- Facilitator Dashboard: http://localhost:5173/dashboard
- Projector: http://localhost:5173/projector

---

## 🏗️ Production Build (Local)

```bash
# Build frontend
cd client && bun run build && cd ..

# Run production server (serves client/dist)
NODE_ENV=production bun run src/server.ts
# Access at http://localhost:3001
```

---

## 🐳 Docker Deployment

### Build and Test Locally

```bash
# Build image
docker build -t sid2026 .

# Run container
docker run -p 8080:8080 \
  -e GOOGLE_APPLICATION_CREDENTIALS="" \
  -e PORT=8080 \
  sid2026

# Access at http://localhost:8080
```

**Note:** On Cloud Run, Firebase Admin SDK uses `applicationDefault()` — no service account file needed.

---

## ☁️ Deploy to Google Cloud Run

### Prerequisites

- Google Cloud project with billing enabled
- `gcloud` CLI installed and authenticated
- Firebase project linked to GCP project

### Deploy Command

```bash
gcloud run deploy sid2026 \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --platform managed \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

Cloud Build will:
1. Build the Docker image using the `Dockerfile`
2. Push to Container Registry
3. Deploy to Cloud Run
4. Provide a public URL (e.g., `https://sid2026-xyz-uc.a.run.app`)

### Environment Variables (Cloud Run)

Set via Cloud Run console or CLI:

```bash
gcloud run services update sid2026 \
  --set-env-vars="NODE_ENV=production"
```

Firebase Admin SDK automatically uses GCP's Application Default Credentials on Cloud Run.

---

## 📱 Event Day Usage

### Before the Event

1. **Test all activities** on staging/test session
2. **Deploy to production** and verify URL works
3. **Create QR code** for participant login URL
4. **Test projector display** at venue (resolution, visibility)
5. **Create facilitator account(s)** and test dashboard access

### During the Event

**Facilitator Workflow:**

1. Open **Dashboard** at `https://your-url.app/dashboard`
2. Display **Projector** on screen: `https://your-url.app/projector`
3. Share **participant URL** via QR code: `https://your-url.app/lobby`
4. Launch activities one by one:
   - Click **LAUNCH** on activity
   - Participants auto-navigate to the activity
   - For **Real or AI**: Use **← PREV / NEXT →** to advance images
   - Click **REVEAL_RESULTS_TO_PROJECTOR** to show charts
   - Click **⛶ FULLSCREEN** to see charts in dashboard popup
5. Click **STOP / RESET_SESSION** to end and return everyone to lobby
6. At end of event: **EXPORT_DATA** button downloads JSON with all responses

**Participant Experience:**

1. Scan QR code → Login/Signup
2. Wait in **Lobby** until facilitator launches activity
3. Join activity (auto-navigates)
4. Submit response
5. Wait for next activity (auto-redirects when facilitator changes)

---

## 🗃️ Data Export

Click **EXPORT_DATA** on Dashboard to download JSON:

```json
{
  "password-poll": [
    {
      "uid": "abc123",
      "name": "John Doe",
      "q0": "yes",
      "q1": "no",
      "q2": "yes",
      "submittedAt": "2026-02-13T10:15:00.000Z"
    }
  ],
  "phishing": [...],
  "real-or-ai": [
    {
      "uid": "abc123",
      "name": "John Doe",
      "vote_0": "A",
      "vote_1": "B",
      "vote_2": "A",
      ...
    }
  ]
}
```

---

## 🔒 Security

- **Firestore Rules:** See `firestore.rules` — participants can only write to their own responses
- **Auth Guards:** Dashboard route requires `isAdmin: true` claim (set via `set-admin.ts`)
- **No PII Logging:** Only name/email stored (required for registration)
- **Service Account:** Never commit `service-account.json` — add to `.gitignore`

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Participant can signup and login
- [ ] Lobby shows "waiting" state when no activity is live
- [ ] Dashboard can launch each of the 6 activities
- [ ] Participant auto-navigates to new activity
- [ ] Response submission works for all activities
- [ ] Real or AI: Images display, voting works for all 6 rounds
- [ ] Charts appear on projector after "Reveal Results"
- [ ] Dashboard fullscreen chart popup works
- [ ] Stopping activity redirects participants to lobby
- [ ] Data export downloads valid JSON

---

## 🐛 Troubleshooting

### "Firebase Admin Initialization Error"
- Check `service-account.json` exists and path is correct in `.env`
- Verify Firebase project ID matches in `admin.ts` and `firebase.ts`

### "Charts not visible"
- Charts use absolute positioning — ensure parent containers have `position: relative`
- Check browser console for Recharts errors

### "Participants stuck on old activity"
- Verify `GameContext` is listening to `sessions/default-session` doc changes
- Check Firestore rules allow read access to session doc

### "Images not loading (Real or AI)"
- Verify images exist in `client/public/Images/` with exact names (`real1.jpeg`, etc.)
- Check browser DevTools Network tab for 404 errors
- Ensure Vite `publicDir` is set correctly (default: `public/`)

### Cloud Run Deployment Fails
- Check `gcloud` is authenticated: `gcloud auth list`
- Verify project is set: `gcloud config set project YOUR_PROJECT_ID`
- Check Cloud Build logs: `gcloud builds list`

---

## 📚 Resources

- [SID2026_PRD.md](./SID2026_PRD.md) — Full product requirements
- [Firebase Documentation](https://firebase.google.com/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Recharts Documentation](https://recharts.org)

---

## 🤝 Contributors

- **Rad5 Tech Hub** — Event hosting and platform development
- **Internet Society Nigeria Chapter** — Partnership and content

---

## 📄 License

Proprietary — Built for SID2026 event by Rad5 Tech Hub

---

## 📞 Support

For event day issues, contact:
- **Email:** support@rad5.tech
- **Event Hotline:** [Add phone number]

---

**#SID2026** | Making the internet safer, together 🌐🔒
