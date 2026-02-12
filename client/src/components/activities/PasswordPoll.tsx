import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';

export const PasswordPoll: React.FC = () => {
    const { user } = useAuth();
    const { currentActivity } = useGame();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'voting' | 'submitted'>('voting');
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (status === 'submitted' && currentActivity && currentActivity !== 'password-poll') {
            if (currentActivity === 'none') navigate('/lobby');
            else navigate(`/activity/${currentActivity}`);
        }
    }, [currentActivity, status, navigate]);

    const QUESTIONS = [
        "Do you use the same password for more than one account?",
        "Does any of your passwords contain your name or birthday?",
        "Have you changed any of your passwords in the last 6 months?"
    ];

    const submitAns = async (answer: 'yes' | 'no') => {
        if (!user) return;
        try {
            await setDoc(doc(db, "sessions", "default-session", "activities", "password-poll", "responses", user.uid), {
                uid: user.uid,
                name: user.displayName || user.email,
                submittedAt: new Date(),
                [`q${currentStep}`]: answer
            }, { merge: true });
            
            if (currentStep < QUESTIONS.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setStatus('submitted');
            }
        } catch (e) {
            console.error(e);
            alert("TRANSMISSION_ERROR");
        }
    };

    return (
        <div id="password-poll-container">
            <h2 id="question-text">{currentStep < QUESTIONS.length ? QUESTIONS[currentStep] : "ALL_QUESTIONS_COMPLETED"}</h2>
            
            {status === 'voting' && (
                <div className="poll-options">
                    <button className="cyber-button" onClick={() => submitAns('yes')}>{">>"} YES</button>
                    <button className="cyber-button" onClick={() => submitAns('no')}>{">>"} NO</button>
                </div>
            )}
            
            {status === 'submitted' && (
                <div id="status-message" style={{marginTop:'30px', textAlign:'center'}}>
                    <p style={{fontSize:'1.2rem', marginBottom:'15px'}}>✅ ALL RESPONSES LOGGED</p>
                    <p className="blink" style={{color:'#888'}}>Waiting for facilitator to launch next activity...</p>
                    <button onClick={() => navigate('/lobby')} style={{marginTop:'20px', padding:'10px 25px', background:'transparent', color:'#00ff00', border:'1px solid #00ff00', cursor:'pointer', fontSize:'1rem'}}>{">>"} RETURN TO LOBBY</button>
                </div>
            )}
        </div>
    );
};
