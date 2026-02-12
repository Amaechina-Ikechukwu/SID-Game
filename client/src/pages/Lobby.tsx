import React from "react";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { Link } from "react-router-dom";

export const Lobby: React.FC = () => {
  const { user } = useAuth();
  const { currentActivity, sessionStatus } = useGame();

  return (
    <div className="container" style={{ textAlign: "center", marginTop: "80px", position: "relative" }}>
      <h1>👋 Welcome, {user?.displayName || user?.email?.split('@')[0]}!</h1>
      
      <div style={{ marginTop: "40px" }}>
        <p style={{ fontSize: '1.1rem', color: '#aaa' }}>
          {sessionStatus === 'active' ? 'An activity is happening now!' : 'Hang tight — the next activity will start soon.'}
        </p>
        
        {sessionStatus === 'active' && currentActivity && currentActivity !== 'none' ? (
            <div style={{ marginTop: "20px", border: "1px solid #00ff00", padding: "25px", borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px' }}>🎯 An activity is live!</h3>
                <Link 
                    to={`/activity/${currentActivity}`}
                    style={{
                        display: "inline-block",
                        marginTop: "10px",
                        padding: "15px 40px",
                        background: "#00ff00",
                        color: "black",
                        textDecoration: "none",
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                        borderRadius: '6px'
                    }}
                >
                    Join Now →
                </Link>
            </div>
        ) : (
             <div style={{ marginTop: '30px' }}>
               <p className="blink" style={{ fontSize: '1.2rem' }}>⏳ Waiting for the facilitator...</p>
               <p style={{ color: '#555', marginTop: '10px', fontSize: '0.9rem' }}>You'll be taken to the activity automatically when it starts.</p>
             </div>
        )}
      </div>
    </div>
  );
};
