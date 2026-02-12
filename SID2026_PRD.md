  
**PRODUCT REQUIREMENTS DOCUMENT**

**SID2026 Interactive Activities Platform**

Safer Internet Day 2026  |  Rad5 Tech Hub x Internet Society Nigeria Chapter

| Version | 1.0 |
| :---- | :---- |
| **Date** | February 2026 |
| **Owner** | Rad5 Tech Hub |
| **Stack** | Bun.js \+ Express  |  Firebase Auth, Firestore, Hosting |
| **Event** | Friday, February 13, 2026  |  3rd Floor, 7 Factory Road, Aba |
| **Hashtag** | \#SID2026 |
| **Status** | Ready for Development |

# **1\. Purpose and Background**

This document defines the full product requirements for the SID2026 Interactive Activities Platform, a web application built to power the live, audience-facing activities during the Safer Internet Day 2026 event hosted by Rad5 Tech Hub in partnership with the Internet Society Nigeria Chapter.

The six activities currently delivered verbally or on static slides will be transformed into a real-time, interactive web experience that participants access on their phones during the event. The platform replaces manual hand-raising, paper cards, and verbal guessing with a live, gamified interface that every person in the room can participate in simultaneously.

## **1.1 Problem Statement**

The current activity format is passive. Facilitators describe activities verbally, ask for hand-raises, and manage participation manually. This limits engagement, makes it difficult to capture responses, and loses the energy that a physical audience brings. It also provides no data on participant understanding or attitudes before and after each session.

## **1.2 Solution**

A mobile-first web app served from an Express backend on Bun.js, hosted on Firebase, where participants log in once with their name and email, then join live activity rooms controlled by the facilitator. Each activity is built as its own interactive module with real-time response tracking via Firestore.

# **2\. Goals and Success Metrics**

## **2.1 Goals**

* Give every participant in the room a way to respond physically and digitally at the same time.

* Enable the facilitator to launch, control, and close each activity from a single dashboard without technical knowledge.

* Capture real-time response data for every activity and display live results on the projector screen.

* Store all participation data in Firestore for post-event reporting and analysis.

* Keep the participant experience simple enough to work on any smartphone with a browser, including entry-level Android phones.

## **2.2 Success Metrics**

* At least 80% of participants in the room successfully join and submit at least one response.

* All six activities load and run without errors on a mobile browser.

* Facilitator can move between activities in under 10 seconds.

* Live results update on screen within 2 seconds of a participant submitting a response.

* All session data is persisted in Firestore and accessible after the event.

# **3\. User Roles**

| Three distinct user roles exist on the platform. |
| :---- |

### **3.1 Participant**

Any attendee at the event. They access the platform via a QR code or short URL displayed on the projector. They register once with their name and email, set a password, and are logged in for the duration of the event. They see only the currently active activity and can submit their response. They cannot navigate between activities, access results, or see the admin dashboard.

### **3.2 Facilitator (Admin)**

The event host or Rad5 team member running the session. They log in with a pre-created admin account. They see a full dashboard with all six activities listed, can launch any activity, see live responses as they come in, display results, close an activity, and move to the next one. They can also export a summary of responses.

### **3.3 Super Admin (Optional, v2)**

A Rad5 account that can manage facilitator accounts, reset event data, and view historical reports across multiple events. Not required for v1.

# **4\. Feature Specifications**

Each of the six activities maps to one feature module. All modules share a common structure: a participant view served as an HTML page from Express, a facilitator control panel, and a Firestore collection for real-time data.

| F-01  Password Hygiene Poll Module: Session 1   Trigger: Facilitator launches from dashboard |
| :---- |
| **Description** Participants are shown three yes/no questions in sequence on their screen. Question 1: Do you use the same password for more than one account? Question 2: Does any of your passwords contain your name or birthday? Question 3: Have you changed any of your passwords in the last 6 months? Each question displays as a large two-button card: Yes or No. Participants tap to respond. The facilitator screen shows a live bar chart that updates as responses come in. After all three questions, the facilitator reveals results to the room on the projector and uses the data to lead a 2-minute conversation about password hygiene. |
| **Firestore document:** *sessions/{sessionId}/activities/password-poll/responses/{userId}* **UI notes:** Participant view: full-screen single question card with two large tap targets. Facilitator view: live bar chart per question, question navigation controls, and a Reveal Results button that sends results to the projector view. |

| F-02  Phishing Spot the Fake Module: Session 1   Trigger: Facilitator launches from dashboard |
| :---- |
| **Description** Two email or SMS examples are displayed side by side on the projector screen via the facilitator display view. Participants on their phones see a simple choice: Which one is the phishing attempt? Option A or Option B. Below the choice, they must select at least one red flag they spotted from a checklist: suspicious sender address, urgent language, unexpected link, grammar errors, requests for personal info, mismatched branding. Participants submit both their answer and their selected red flags. The facilitator reveals correct answer and a live breakdown of which red flags the room identified. The red flag frequency chart shows which warning signs participants spotted most and least, guiding the facilitator on where to spend more explanation time. |
| **Firestore document:** *sessions/{sessionId}/activities/phishing/responses/{userId}* **UI notes:** Participant view: A/B choice at top, scrollable red flag checklist below, Submit button. Facilitator view: live donut chart for A/B split, bar chart of red flags ranked by frequency, correct answer toggle. |

| F-03  App Tracking Quick Poll Module: Session 1   Trigger: Facilitator launches from dashboard |
| :---- |
| **Description** Participants are shown one scenario: You just found out an app on your phone has been tracking your location without your knowledge. They select one of four responses: Delete the app immediately. Go to settings and revoke the location permission. Ignore it, most apps do this. Report it to the app store. Participants can only select one answer. Results are shown as a live percentage bar chart that updates in real time on the projector. Facilitator uses the distribution to open a discussion about app permissions and what each response actually achieves. |
| **Firestore document:** *sessions/{sessionId}/activities/tracking-poll/responses/{userId}* **UI notes:** Participant view: scenario text at top, four large radio-button option cards, Submit button. Facilitator view: live horizontal bar chart, total response count, projector display mode. |

| F-04  Real or AI Image Challenge Module: Session 2   Trigger: Facilitator launches from dashboard |
| :---- |
| **Description** The facilitator displays images on the projector one at a time using the facilitator display view. For each image, participants on their phones see a full-screen card with two buttons: Real or AI. There are 6 images in a set. Participants vote on each before the facilitator advances to the next. After all 6 images, a personal score is shown to each participant: how many they got right. A leaderboard is shown on the projector displaying the top 5 scorers by name. The facilitator can review each image with a reveal overlay showing the correct answer and an explanation of the AI tells. |
| **Firestore document:** *sessions/{sessionId}/activities/real-or-ai/responses/{userId}/images/{imageIndex}* **UI notes:** Participant view: image thumbnail or description card (image shown on projector only to avoid spoiling), Real/AI buttons, live score counter. Facilitator view: image advance controls, live vote tally per image, leaderboard, reveal toggle. Admin must pre-upload 6 images via the dashboard before the session. |

| F-05  Misinformation Headline Test Module: Session 2   Trigger: Facilitator launches from dashboard |
| :---- |
| **Description** A realistic-looking but fabricated news headline is displayed on the projector. Participants on their phones answer two questions in sequence. Question 1: Would you share this? Yes or No. Question 2: Why did you decide that way? Select all that apply from: It looks official, The source seems credible, The headline is urgent or alarming, I recognised the format from real news, I would verify before sharing, I never share without checking. After responses are collected, the facilitator reveals that the headline is fake and walks through the fact-checking process step by step. The results show the share vs no-share split and the most common reasons participants gave, making the misinformation mechanics visible. |
| **Firestore document:** *sessions/{sessionId}/activities/misinformation/responses/{userId}* **UI notes:** Participant view: two-step form, step 1 is a yes/no card, step 2 is a multi-select checklist. Facilitator view: live share/no-share split donut, reason frequency chart, step-by-step fact-check reveal mode. |

| F-06  Verdict Vote Module: Session 3   Trigger: Facilitator launches from dashboard |
| :---- |
| **Description** A case study is displayed on the projector. The default case is: A secondary school student shared a private screenshot of a classmate in a 200-person WhatsApp group. The image spread to other schools and the classmate was severely bullied and stopped attending school. Participants vote on the correct consequence from four options: Expel the student, Give a formal warning, Report to the police, The school has no responsibility. After voting closes, results are revealed as a live percentage breakdown. Participants then rate how confident they are in their answer on a 1 to 5 scale. The facilitator uses both the vote distribution and confidence levels to guide the discussion, noting where the room is split and where it is confident. The facilitator can load a second or third case study if time allows. Up to three case studies can be pre-loaded in the admin dashboard. |
| **Firestore document:** *sessions/{sessionId}/activities/verdict-vote/responses/{userId}/cases/{caseIndex}* **UI notes:** Participant view: case study text, four voting cards, confidence slider. Facilitator view: live vote distribution chart, confidence average, case study advance controls, reveal mode. Admin can edit case study text from the dashboard before the event. |

# **5\. Authentication and Session Management**

## **5.1 Firebase Auth**

Authentication is handled entirely through Firebase Authentication using email and password. No third-party OAuth providers are required for v1.

### **Participant Registration**

* Participant visits the event URL and is directed to a registration page.

* Registration form collects: Display name (first name or full name), Email address, Password (minimum 8 characters).

* Firebase createUserWithEmailAndPassword is called on submit.

* On success, the displayName field on the Firebase user profile is updated with the entered name.

* Participant is immediately redirected to the participant lobby where they wait for the facilitator to launch an activity.

### **Participant Login (Returning)**

* If a participant registered previously, they can log in with their email and password from the same page.

* A toggle between Register and Log In is shown on the auth page.

### **Facilitator Login**

* Facilitator accounts are created manually in the Firebase console or by the super admin before the event.

* Facilitator accounts are identified by a custom claim: role: facilitator set via Firebase Admin SDK.

* On login, the Express backend verifies the ID token and checks for the facilitator claim before serving the admin dashboard.

## **5.2 Session Handling**

* The Express server uses Firebase ID tokens passed as cookies or Authorization headers for all protected routes.

* Tokens are verified server-side on every protected request using firebase-admin.

* Participants stay logged in for the duration of the event. Token refresh is handled client-side by the Firebase JS SDK.

* On event close, the facilitator can mark the session as ended. Participants attempting to access the app after this point see a session closed screen.

# **6\. Firestore Data Model**

All data is stored in Cloud Firestore. The root structure is organised around sessions, with each event being one session document.

## **6.1 Collection Structure**

| sessions/{sessionId} |
| :---- |

* id: string (auto-generated)

* name: string (e.g. SID2026 Aba)

* date: timestamp

* status: string (waiting | active | ended)

* currentActivity: string (null or activity id e.g. password-poll)

* facilitatorUid: string

| sessions/{sessionId}/participants/{userId} |
| :---- |

* uid: string (Firebase Auth UID)

* name: string

* email: string

* joinedAt: timestamp

* score: number (for Real or AI leaderboard)

| sessions/{sessionId}/activities/{activityId} |
| :---- |

* id: string (e.g. password-poll, phishing, tracking-poll, real-or-ai, misinformation, verdict-vote)

* status: string (inactive | active | revealing | closed)

* currentStep: number (for multi-step activities)

* launchedAt: timestamp

* closedAt: timestamp

| sessions/{sessionId}/activities/{activityId}/responses/{userId} |
| :---- |

* uid: string

* name: string

* submittedAt: timestamp

* data: object (activity-specific, see feature specs above)

# **7\. Technical Architecture**

## **7.1 Runtime and Framework**

* Runtime: Bun.js (replaces Node.js for all server-side execution)

* Web framework: Express.js running on Bun

* Templating: Server-rendered HTML using a lightweight template engine such as EJS or plain template literals. All UI is generated and served from the Express backend. No separate frontend framework.

* Styling: Plain CSS or a utility framework such as Tailwind CSS via CDN. No build step required.

* Real-time updates: Firestore client SDK loaded in the browser via CDN for live listeners on participant and facilitator screens.

## **7.2 Firebase Services Used**

* Firebase Authentication: Email and password auth for all users.

* Cloud Firestore: Primary database for sessions, participants, activities, and responses.

* Firebase Hosting: Static asset hosting and URL rewriting to the Express backend via Firebase Functions or Cloud Run.

* Firebase Admin SDK: Used server-side in Express for token verification and setting custom claims.

## **7.3 Deployment Model**

* The Express app is deployed as a Firebase Cloud Function using the functions framework, or alternatively as a containerised service on Cloud Run connected to Firebase Hosting rewrites.

* All HTML, CSS, and client-side JS assets are served from the Express routes, not as static files from Firebase Hosting directly.

* Firebase Hosting serves as the CDN and handles the public URL, routing all requests to the Express backend.

## **7.4 Project File Structure**

Recommended folder layout for the agent building this project:

| project-root/   src/     server.ts           \# Bun \+ Express entry point     routes/             \# One file per route group       auth.ts           \# Login, register, logout       participant.ts    \# Participant lobby and activity views       facilitator.ts   \# Admin dashboard and controls       activities.ts    \# Activity launch, close, response endpoints     middleware/       auth.ts          \# Firebase token verification middleware       role.ts          \# Facilitator role guard     views/             \# EJS or HTML template files       auth/            \# login.ejs, register.ejs       participant/     \# lobby.ejs, activity.ejs, waiting.ejs       facilitator/     \# dashboard.ejs, activity-control.ejs       projector/       \# projector.ejs (fullscreen display view)     firebase/       admin.ts         \# Firebase Admin SDK init       firestore.ts     \# Firestore helper functions   public/     css/style.css      \# Global styles     js/firebase.js     \# Client-side Firestore listeners   firebase.json        \# Firebase hosting \+ functions config   firestore.rules      \# Firestore security rules   bun.lockb   package.json   tsconfig.json |
| :---- |

# **8\. API and Route Specification**

All routes are served from the Express backend. HTML pages are server-rendered and returned as full documents. Activity responses are submitted via POST and stored directly in Firestore from the server.

| Method | Path | Auth | Description |
| :---- | :---- | :---- | :---- |
| **GET** | */* | **No** | Landing page with event info and link to register or log in |
| **GET** | */auth/register* | **No** | Registration page for participants |
| **POST** | */auth/register* | **No** | Creates Firebase user, sets display name, redirects to lobby |
| **GET** | */auth/login* | **No** | Login page for participants and facilitators |
| **POST** | */auth/login* | **No** | Verifies credentials, sets session cookie, redirects by role |
| **POST** | */auth/logout* | **Yes** | Clears session cookie and redirects to login |
| **GET** | */lobby* | **Yes** | Participant waiting room. Listens for currentActivity changes |
| **GET** | */activity/:id* | **Yes** | Renders the participant view for the active activity |
| **POST** | */activity/:id/respond* | **Yes** | Saves participant response to Firestore |
| **GET** | */admin* | **Yes** | Facilitator dashboard listing all six activities and their status |
| **POST** | */admin/activity/:id/launch* | **Yes** | Sets activity status to active in Firestore |
| **POST** | */admin/activity/:id/step* | **Yes** | Advances multi-step activity to next step |
| **POST** | */admin/activity/:id/reveal* | **Yes** | Sets activity status to revealing, triggers results display |
| **POST** | */admin/activity/:id/close* | **Yes** | Sets activity status to closed |
| **GET** | */projector/:id* | **Yes** | Fullscreen display view for projector. Auto-refreshes via Firestore listener |
| **GET** | */admin/export* | **Yes** | Downloads a JSON or CSV summary of all responses for the session |

# **9\. Firestore Security Rules**

The following rules must be implemented in firestore.rules before deployment. They enforce that participants can only write their own responses and cannot access other participants or admin data.

| rules\_version \= '2'; service cloud.firestore {   match /databases/{database}/documents {     *// Sessions: read by any authenticated user, write by facilitator only*     match /sessions/{sessionId} {       allow read: if request.auth \!= null;       allow write: if request.auth.token.role \== 'facilitator';     }     *// Participants: any auth user can register themselves*     match /sessions/{sessionId}/participants/{userId} {       allow read: if request.auth \!= null;       allow write: if request.auth.uid \== userId;     }     *// Activities: read by all auth users, write by facilitator only*     match /sessions/{sessionId}/activities/{activityId} {       allow read: if request.auth \!= null;       allow write: if request.auth.token.role \== 'facilitator';     }     *// Responses: participant can write only their own*     match /sessions/{sessionId}/activities/{activityId}/responses/{userId} {       allow read: if request.auth.token.role \== 'facilitator';       allow write: if request.auth.uid \== userId;     }   } } |
| :---- |

# **10\. UI and UX Requirements**

## **10.1 Participant Screen**

* Mobile-first. All participant views must work at 375px width and above without horizontal scrolling.

* Every interactive element (buttons, choices, sliders) must have a minimum tap target size of 44 by 44 pixels.

* Waiting screen between activities must be visually clear and branded with the event name and hashtag \#SID2026.

* Response confirmation must be immediate. After submission, show a clear confirmation state so participants know their response was received.

* Participants cannot change a submitted response. The submit button is disabled after first submission.

* Font size minimum 16px for all body text on participant screens.

## **10.2 Facilitator Dashboard**

* Desktop-optimised but must also work on a tablet.

* Activity list shows all six activities with their current status (inactive, active, revealing, closed) as colour-coded badges.

* Only one activity can be active at a time. Launching a new activity automatically closes the current one.

* Live response count is always visible on the active activity card.

* Reveal and Close buttons are visually distinct and require a single click. No confirmation dialogs to avoid slowing the facilitator down.

## **10.3 Projector View**

* A dedicated fullscreen route (/projector/:id) serves as the display for the projector or screen at the event.

* This view auto-updates via a Firestore real-time listener. The facilitator does not need to refresh it.

* Results are displayed as large, readable charts. Text must be legible from 5 to 10 metres away.

* The Rad5 Tech Hub and Internet Society Nigeria Chapter logos and the \#SID2026 hashtag appear in the footer of every projector view.

# **11\. Constraints and Assumptions**

## **11.1 Constraints**

* The app must work on low-end Android phones running Chrome. Do not rely on features unavailable in Chrome 90 and above.

* Internet connectivity at the venue may be shared across many devices. Minimise payload size. Avoid large images or video in participant views.

* No SMS or email notifications are required for v1.

* The app is single-session only for v1. It is designed for one event. Multi-session management is a v2 feature.

* All UI text must be in plain English. No Yoruba, Igbo, or Hausa localisation required for v1.

## **11.2 Assumptions**

* The facilitator will have a reliable internet connection on their laptop for the duration of the event.

* Participants will access the app via a QR code displayed on the projector. A short custom URL is also acceptable as a fallback.

* The facilitator account will be created manually in Firebase Console before the event day.

* The session document in Firestore will be seeded with all six activity sub-documents before the event.

* The six images required for the Real or AI activity (F-04) will be uploaded by the facilitator before the event using the admin dashboard upload tool.

# **12\. Out of Scope for v1**

* Native iOS or Android app. Web only.

* Offline mode or progressive web app functionality.

* Email notifications or post-event summary emails to participants.

* Admin ability to create or edit activities from the dashboard. Activity content is hardcoded for v1 except for Verdict Vote case studies.

* Multi-language support.

* Analytics dashboard or visualisation of aggregate data across multiple events.

* Social sharing from within the app.

* Super admin role and cross-event reporting.

# **13\. Notes for the AI Agent Building This**

If you are an AI agent reading this document to build the project, the following points are critical.

1. Use Bun.js as the runtime. Do not use Node.js. The entry command should be bun run src/server.ts.

2. Express is the only required web framework. Do not install React, Next.js, Vite, or any other frontend framework. All views are server-rendered HTML templates.

3. Use the Firebase Admin SDK for all server-side Firebase operations. Use the Firebase Client SDK (loaded via CDN in browser) only for real-time Firestore listeners on the participant and projector views.

4. The client-side Firebase SDK must be loaded from the Firebase CDN. Do not bundle it with a build tool.

5. Real-time updates on participant screens work by the browser opening a Firestore listener on the session document. When currentActivity changes in Firestore, the participant view automatically redirects to the new activity page. This listener lives in public/js/firebase.js and is included in all participant view templates.

6. All POST requests that save responses must verify the Firebase ID token server-side before writing to Firestore. Use the auth middleware in middleware/auth.ts for this.

7. Do not use localStorage or sessionStorage for authentication. Use HTTP-only cookies to store the session token server-side.

8. Implement Firestore security rules exactly as specified in Section 9 before deploying.

9. The facilitator dashboard must prevent two activities from being active at the same time. Enforce this at the server level, not just the UI level.

10. For the Real or AI activity, the facilitator controls image advancement from their dashboard. The image itself is never sent to participant phones. Participants vote blind based on what they see on the projector. The participant phone shows only the vote buttons and their current score.

Rad5 Tech Hub  |  www.isoc.ng  |  \#SID2026  |  Together for a Better Internet