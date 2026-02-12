import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';

export const TrackingPoll: React.FC = () => {
    const { user } = useAuth();
    const { currentActivity } = useGame();
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (submitted && currentActivity && currentActivity !== 'tracking-poll') {
            if (currentActivity === 'none') navigate('/lobby');
            else navigate(`/activity/${currentActivity}`);
        }
    }, [currentActivity, submitted, navigate]);

    const submitTracking = async () => {
        if (!user || !selectedOption) return;
        try {
            await setDoc(doc(db, "sessions", "default-session", "activities", "tracking-poll", "responses", user.uid), {
                uid: user.uid,
                option: selectedOption,
                submittedAt: new Date()
            });
            setSubmitted(true);
        } catch (e) {
            console.error(e);
            alert("TRANSMISSION_ERROR");
        }
    };

    if (submitted) {
        return (
            <div style={{marginTop:'30px', textAlign:'center'}}>
                <p style={{fontSize:'1.3rem', marginBottom:'15px'}}>✅ Answer submitted!</p>
                <p className="blink" style={{color:'#888'}}>Waiting for the next activity...</p>
                <button onClick={() => navigate('/lobby')} style={{marginTop:'20px', padding:'10px 25px', background:'transparent', color:'#00ff00', border:'1px solid #00ff00', cursor:'pointer', fontSize:'1rem', borderRadius:'6px'}}>← Back to Lobby</button>
            </div>
        );
    }

    return (
        <div id="tracking-container">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>📱 App Tracking</h2>
            <div style={{ background: 'rgba(0,255,0,0.05)', border: '1px solid #333', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.5', color: '#ccc' }}>
                    You just found out that an app on your phone has been <strong style={{color:'#ff6b6b'}}>tracking your location</strong> without your knowledge. What would you do?
                </p>
            </div>
            
            <div className="poll-options" style={{textAlign: 'left'}}>
                {[
                    {val: "delete", label: "Delete the app immediately"},
                    {val: "settings", label: "Go to settings and turn off location permission"},
                    {val: "ignore", label: "Ignore it — most apps do this anyway"},
                    {val: "report", label: "Report the app to the app store"}
                ].map(opt => (
                    <label key={opt.val} style={{display:'flex', alignItems:'center', border: selectedOption === opt.val ? '2px solid #00ff00' : '1px solid #444', padding:'15px', marginBottom:'10px', cursor:'pointer', background: selectedOption === opt.val ? 'rgba(0,255,0,0.08)' : 'transparent', borderRadius:'8px', transition:'all 0.2s'}}>
                        <input 
                            type="radio" 
                            name="tracking_option" 
                            value={opt.val} 
                            checked={selectedOption === opt.val}
                            onChange={() => setSelectedOption(opt.val)}
                            style={{width:'auto', marginRight:'12px', minWidth:'18px', height:'18px'}}
                        />
                        <span style={{ fontSize: '1rem' }}>{opt.label}</span>
                    </label>
                ))}
            </div>

            <button 
                className="cyber-button action-btn" 
                onClick={submitTracking} 
                disabled={!selectedOption}
                style={{ opacity: !selectedOption ? 0.5 : 1, padding: '15px 30px', fontSize: '1.1rem', borderRadius: '8px', marginTop: '10px' }}
            >
                Submit Answer
            </button>
        </div>
    );
};
