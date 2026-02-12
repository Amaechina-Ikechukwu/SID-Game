import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';

export const RealOrAi: React.FC = () => {
    const { user } = useAuth();
    const { currentActivity, imageIndex } = useGame();
    const navigate = useNavigate();
    const [votedRounds, setVotedRounds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (currentActivity && currentActivity !== 'real-or-ai') {
            if (currentActivity === 'none') navigate('/lobby');
            else navigate(`/activity/${currentActivity}`);
        }
    }, [currentActivity, navigate]);

    const hasVotedThisRound = votedRounds.has(imageIndex);

    const vote = async (choice: 'A' | 'B') => {
        if (!user) return;
        try {
            await setDoc(doc(db, "sessions", "default-session", "activities", "real-or-ai", "responses", user.uid), {
                uid: user.uid,
                name: user.displayName || user.email,
                [`vote_${imageIndex}`]: choice,
                submittedAt: new Date()
            }, { merge: true });
            
            setVotedRounds(prev => new Set(prev).add(imageIndex));
        } catch (e) {
            console.error(e);
            alert("Something went wrong. Try again.");
        }
    };

    const IMAGE_PAIRS = [
        { real: '/Images/real1.jpeg', fake: '/Images/fake1.jpeg', realSide: 'A' },
        { real: '/Images/real2.jpeg', fake: '/Images/fake2.jpeg', realSide: 'B' },
        { real: '/Images/real3.jpeg', fake: '/Images/fake3.jpeg', realSide: 'A' },
        { real: '/Images/real4.jpeg', fake: '/Images/fake4.jpeg', realSide: 'B' },
        { real: '/Images/real5.jpeg', fake: '/Images/fake5.jpeg', realSide: 'A' },
        { real: '/Images/real6.jpeg', fake: '/Images/fake6.jpeg', realSide: 'B' },
    ];

    const currentPair = IMAGE_PAIRS[imageIndex] || IMAGE_PAIRS[0];
    const leftImage = currentPair.realSide === 'A' ? currentPair.real : currentPair.fake;
    const rightImage = currentPair.realSide === 'A' ? currentPair.fake : currentPair.real;

    return (
        <div id="real-or-ai-container">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '5px' }}>🖼️ Real or AI?</h2>
            <p style={{ color: '#888', marginBottom: '8px', fontSize: '1rem' }}>Round {imageIndex + 1} of 6</p>
            <p style={{ fontSize: '1rem', color: '#ccc', marginBottom: '15px' }}>Which image is <strong style={{color:'#00ff00'}}>AI-generated</strong>? Tap to vote.</p>
            
            {!hasVotedThisRound ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div 
                        onClick={() => vote('A')}
                        style={{ cursor: 'pointer', border: '2px solid #333', borderRadius: '8px', overflow: 'hidden', textAlign: 'center', transition: 'all 0.2s' }}
                    >
                        <img src={leftImage} alt="Image A" style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '1', objectFit: 'cover' }} />
                        <div style={{ padding: '10px', background: 'rgba(0,255,0,0.05)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                            🅰️ Image A
                        </div>
                    </div>
                    <div 
                        onClick={() => vote('B')}
                        style={{ cursor: 'pointer', border: '2px solid #333', borderRadius: '8px', overflow: 'hidden', textAlign: 'center', transition: 'all 0.2s' }}
                    >
                        <img src={rightImage} alt="Image B" style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '1', objectFit: 'cover' }} />
                        <div style={{ padding: '10px', background: 'rgba(0,255,0,0.05)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                            🅱️ Image B
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{marginTop:'20px', textAlign:'center'}}>
                    <p style={{ fontSize: '1.2rem' }}>✅ Vote recorded for Round {imageIndex + 1}!</p>
                    <p className="blink" style={{ color: '#888', marginTop: '10px' }}>Waiting for the next image...</p>
                    <p style={{ color: '#555', marginTop: '15px', fontSize: '0.85rem' }}>
                        You've voted on {votedRounds.size} of 6 rounds
                    </p>
                </div>
            )}
        </div>
    );
};
