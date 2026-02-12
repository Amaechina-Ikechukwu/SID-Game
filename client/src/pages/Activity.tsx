import React from "react";
import { useParams } from "react-router-dom";
import { PasswordPoll } from "../components/activities/PasswordPoll";
import { Phishing } from "../components/activities/Phishing";
import { Misinformation } from "../components/activities/Misinformation";
import { RealOrAi } from "../components/activities/RealOrAi";
import { TrackingPoll } from "../components/activities/TrackingPoll";
import { VerdictVote } from "../components/activities/VerdictVote";

export const Activity: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  let Component;
  const activityNames: Record<string, string> = {
    'password-poll': '🔐 Password Hygiene',
    'phishing': '🔍 Spot the Fake',
    'tracking-poll': '📱 App Tracking',
    'real-or-ai': '🖼️ Real or AI?',
    'misinformation': '📰 Headline Check',
    'verdict-vote': '⚖️ The Verdict'
  };

  switch (id) {
    case 'password-poll': Component = PasswordPoll; break;
    case 'phishing': Component = Phishing; break;
    case 'misinformation': Component = Misinformation; break;
    case 'real-or-ai': Component = RealOrAi; break;
    case 'tracking-poll': Component = TrackingPoll; break;
    case 'verdict-vote': Component = VerdictVote; break;
    default: Component = () => <div>UNKNOWN_MODULE</div>;
  }

  return (
    <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{activityNames[id || ''] || id?.toUpperCase()}</h1>
      <div style={{ border: "1px solid #00ff00", padding: "20px", margin: "20px" }}>
        <Component />
      </div>
    </div>
  );
};

