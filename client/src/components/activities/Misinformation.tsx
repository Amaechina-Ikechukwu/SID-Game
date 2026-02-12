import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';

export const Misinformation: React.FC = () => {
    const { user } = useAuth();
    const { currentActivity } = useGame();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [shareChoice, setShareChoice] = useState<boolean | null>(null);
    const [reasons, setReasons] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (submitted && currentActivity && currentActivity !== 'misinformation') {
            if (currentActivity === 'none') navigate('/lobby');
            else navigate(`/activity/${currentActivity}`);
        }
    }, [currentActivity, submitted, navigate]);

    const toggleReason = (value: string) => {
        setReasons(prev => 
            prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
        );
    };

    const submitMisinfo = async () => {
        if (!user || shareChoice === null) return;
        try {
            await setDoc(doc(db, "sessions", "default-session", "activities", "misinformation", "responses", user.uid), {
                uid: user.uid,
                share: shareChoice,
                reasons: reasons,
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
        <div id="misinformation-container">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>📰 Headline Check</h2>
            <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '20px' }}>Look at the news headline on the projector screen.</p>
            
            {step === 1 && (
                <div id="step-1">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Would you share this headline?</h3>
                    <div className="options-grid" style={{display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px'}}>
                        <button className="cyber-button" onClick={() => { setShareChoice(true); setStep(2); }} style={{ padding: '18px 35px', fontSize: '1.2rem', borderRadius: '8px' }}>👍 Yes, I'd share it</button>
                        <button className="cyber-button" onClick={() => { setShareChoice(false); setStep(2); }} style={{ padding: '18px 35px', fontSize: '1.2rem', borderRadius: '8px' }}>👎 No, I wouldn't</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div id="step-2">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Why did you make that choice? (select all that apply)</h3>
                    <div className="red-flags-list" style={{textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '25px'}}>
                        {[
                            {val: "looks_official", label: "It looks official / professional"},
                            {val: "credible_source", label: "The source seems credible"},
                            {val: "urgent_alarming", label: "The headline feels urgent or alarming"},
                            {val: "recognised_format", label: "I recognised the format from real news"},
                            {val: "would_verify", label: "I would verify it first before sharing"},
                            {val: "never_share", label: "I never share without checking the facts"}
                        ].map(opt => (
                            <label key={opt.val} style={{display:'flex', alignItems:'center', padding:'12px 15px', cursor:'pointer', border: reasons.includes(opt.val) ? '1px solid #00ff00' : '1px solid #333', borderRadius: '8px', background: reasons.includes(opt.val) ? 'rgba(0,255,0,0.08)' : 'transparent', transition: 'all 0.2s'}}>
                                <input 
                                    type="checkbox" 
                                    checked={reasons.includes(opt.val)}
                                    onChange={() => toggleReason(opt.val)}
                                    style={{marginRight: '12px', width: 'auto', minWidth: '18px', height: '18px'}}
                                /> 
                                <span style={{ fontSize: '1rem' }}>{opt.label}</span>
                            </label>
                        ))}
                    </div>
                    <button className="cyber-button action-btn" onClick={submitMisinfo} style={{ padding: '15px 30px', fontSize: '1.1rem', borderRadius: '8px' }}>Submit Answer</button>
                </div>
            )}
        </div>
    );
};
