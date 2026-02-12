import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';

export const VerdictVote: React.FC = () => {
    const { user } = useAuth();
    const { currentActivity } = useGame();
    const navigate = useNavigate();
    const [verdict, setVerdict] = useState<string | null>(null);
    const [confidence, setConfidence] = useState(3);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (submitted && currentActivity && currentActivity !== 'verdict-vote') {
            if (currentActivity === 'none') navigate('/lobby');
            else navigate(`/activity/${currentActivity}`);
        }
    }, [currentActivity, submitted, navigate]);

    const submitVerdict = async () => {
        if (!user || !verdict) return;
        try {
            await setDoc(doc(db, "sessions", "default-session", "activities", "verdict-vote", "responses", user.uid), {
                uid: user.uid,
                verdict: verdict,
                confidence: confidence,
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
                <p style={{fontSize:'1.3rem', marginBottom:'15px'}}>✅ Vote submitted!</p>
                <p className="blink" style={{color:'#888'}}>Waiting for the next activity...</p>
                <button onClick={() => navigate('/lobby')} style={{marginTop:'20px', padding:'10px 25px', background:'transparent', color:'#00ff00', border:'1px solid #00ff00', cursor:'pointer', fontSize:'1rem', borderRadius:'6px'}}>← Back to Lobby</button>
            </div>
        );
    }

    return (
        <div id="verdict-container">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>⚖️ The Verdict</h2>
            <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '15px' }}>Read the case study on the projector screen, then choose what you think the consequence should be:</p>
            
            <div className="poll-options" style={{textAlign: 'left'}}>
                {[
                    {val: "expel", label: "Expel the student"},
                    {val: "warning", label: "Give a formal warning"},
                    {val: "police", label: "Report to the police"},
                    {val: "none", label: "The school has no responsibility"}
                ].map(opt => (
                    <label key={opt.val} style={{display:'flex', alignItems:'center', border: verdict === opt.val ? '2px solid #00ff00' : '1px solid #444', padding:'15px', marginBottom:'10px', cursor:'pointer', background: verdict === opt.val ? 'rgba(0,255,0,0.08)' : 'transparent', borderRadius:'8px', transition:'all 0.2s'}}>
                        <input 
                            type="radio" 
                            name="verdict" 
                            value={opt.val} 
                            checked={verdict === opt.val}
                            onChange={() => setVerdict(opt.val)}
                            style={{width:'auto', marginRight:'12px', minWidth:'18px', height:'18px'}}
                        />
                        <span style={{ fontSize: '1rem' }}>{opt.label}</span>
                    </label>
                ))}
            </div>

            {verdict && (
                <div id="confidence-section" style={{marginTop: '25px'}}>
                    <p style={{ fontSize: '1.05rem', marginBottom: '8px' }}>How confident are you? <strong>{confidence}</strong>/5</p>
                    <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        value={confidence} 
                        onChange={(e) => setConfidence(parseInt(e.target.value))}
                        style={{width: '100%'}} 
                    />
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888'}}>
                        <span>Not sure at all</span>
                        <span>Very confident</span>
                    </div>
                    
                    <button className="cyber-button action-btn" onClick={submitVerdict} style={{ padding: '15px 30px', fontSize: '1.1rem', borderRadius: '8px', marginTop: '15px' }}>Submit Vote</button>
                </div>
            )}
            
        </div>
    );
};
