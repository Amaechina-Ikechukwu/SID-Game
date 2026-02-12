import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';

export const Phishing: React.FC = () => {
    const { user } = useAuth();
    const { currentActivity } = useGame();
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
    const [redFlags, setRedFlags] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (submitted && currentActivity && currentActivity !== 'phishing') {
            if (currentActivity === 'none') navigate('/lobby');
            else navigate(`/activity/${currentActivity}`);
        }
    }, [currentActivity, submitted, navigate]);

    const toggleRedFlag = (value: string) => {
        setRedFlags(prev => 
            prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
        );
    };

    const submitPhishing = async () => {
        if (!user || !selectedOption) return;
        try {
            await setDoc(doc(db, "sessions", "default-session", "activities", "phishing", "responses", user.uid), {
                uid: user.uid,
                choice: selectedOption,
                redFlags: redFlags,
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
        <div id="phishing-container">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '5px' }}>🔍 Spot the Fake</h2>
            <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '20px' }}>Look at the two messages on the projector. Which one is phishing, and what red flags did you notice?</p>
            
            <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', color: '#00ff00' }}>Which email is the phishing attempt?</h3>
            <div className="red-flags-list" style={{textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px'}}>
                {[
                    {val: "suspicious_sender", label: "📧 The sender's email looks suspicious", option: 'A'},
                    {val: "urgent_language", label: "⚠️ Uses urgent or threatening language", option: 'A'},
                    {val: "unexpected_link", label: "🔗 Contains a suspicious or unexpected link", option: 'A'},
                    {val: "grammar_errors", label: "✏️ Has spelling or grammar mistakes", option: 'A'},
                    {val: "personal_info_request", label: "🔐 Asks for personal information", option: 'A'},
                    {val: "mismatched_branding", label: "🏢 Branding doesn't match the real company", option: 'A'}
                ].map(opt => (
                    <label key={opt.val} style={{
                        display:'flex', 
                        alignItems:'center', 
                        padding:'14px 16px', 
                        cursor:'pointer', 
                        border: redFlags.includes(opt.val) ? '2px solid #00ff00' : '1px solid #333', 
                        borderRadius: '8px', 
                        background: redFlags.includes(opt.val) ? 'rgba(0,255,0,0.1)' : 'transparent', 
                        transition: 'all 0.2s',
                        boxShadow: redFlags.includes(opt.val) ? '0 0 10px rgba(0,255,0,0.3)' : 'none'
                    }}>
                        <input 
                            type="checkbox" 
                            checked={redFlags.includes(opt.val)}
                            onChange={() => {
                                toggleRedFlag(opt.val);
                                if (!selectedOption) setSelectedOption(opt.option as 'A' | 'B');
                            }}
                            style={{marginRight: '14px', width: 'auto', minWidth: '20px', height: '20px', accentColor: '#00ff00'}}
                        /> 
                        <span style={{ fontSize: '1.05rem', lineHeight: '1.4' }}>{opt.label}</span>
                    </label>
                ))}
            </div>

            <button 
                className="cyber-button action-btn" 
                onClick={submitPhishing} 
                disabled={redFlags.length === 0}
                style={{ opacity: redFlags.length === 0 ? 0.5 : 1, padding: '16px 35px', fontSize: '1.15rem', borderRadius: '8px' }}
            >
                Submit Answer
            </button>
            {redFlags.length === 0 && <p style={{ color: '#666', marginTop: '10px', fontSize: '0.9rem' }}>💡 Tip: Select all the red flags you spot in the phishing email (Option A)</p>}
        </div>
    );
};
