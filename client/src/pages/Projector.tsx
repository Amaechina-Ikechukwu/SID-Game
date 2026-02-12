import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ResultsView } from '../components/projector/ResultsView';

const IMAGE_PAIRS = [
    { real: '/Images/real1.jpeg', fake: '/Images/fake1.jpeg', realSide: 'A' },
    { real: '/Images/real2.jpeg', fake: '/Images/fake2.jpeg', realSide: 'B' },
    { real: '/Images/real3.jpeg', fake: '/Images/fake3.jpeg', realSide: 'A' },
    { real: '/Images/real4.jpeg', fake: '/Images/fake4.jpeg', realSide: 'B' },
    { real: '/Images/real5.jpeg', fake: '/Images/fake5.jpeg', realSide: 'A' },
    { real: '/Images/real6.jpeg', fake: '/Images/fake6.jpeg', realSide: 'B' },
];

export const Projector: React.FC = () => {
    const [activity, setActivity] = useState<string>("none");
    const [status, setStatus] = useState("idle");
    const [imageIndex, setImageIndex] = useState(0);

    const currentPair = IMAGE_PAIRS[imageIndex] || IMAGE_PAIRS[0];
    const leftImage = currentPair.realSide === 'A' ? currentPair.real : currentPair.fake;
    const rightImage = currentPair.realSide === 'A' ? currentPair.fake : currentPair.real;

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "sessions", "default-session"), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setActivity(data.currentActivity || "none");
                setStatus(data.status || "idle");
                setImageIndex(data.imageIndex || 0);
            }
        });
        return () => unsub();
    }, []);

    return (
        <div style={{ 
            width: '100vw', 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            background: 'black', 
            color: '#00ff00',
            fontSize: '2rem'
        }}>
            <div className="container" style={{ width: '98%', height: '98vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', flexShrink: 0 }}>
                    <h1 style={{ fontSize: '1.8rem', margin: 0 }}>SID2026 — Safer Internet Day</h1>
                    <span style={{ fontSize: '1.2rem', color: '#555' }}>#SID2026 | Rad5 Tech Hub x ISOC Nigeria</span>
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.3rem', flexShrink: 0 }}>
                        {activity !== 'none' ? `ACTIVE: ${activity.toUpperCase().replace(/-/g, ' ')}` : "SYSTEM IDLE"}
                    </h2>
                    
                    <div style={{ 
                        width: '100%', 
                        flex: 1,
                        minHeight: 0,
                        border: '2px solid #00ff00', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        background: '#0a0a0a',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {activity !== 'none' ? (
                            (status === 'revealing' || status === 'closed' || activity === 'tracking-poll' || activity === 'password-poll') ? (
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                                    <ResultsView activityId={activity} status={status} />
                                </div>
                            ) : activity === 'phishing' ? (
                                <div style={{ textAlign: 'center', padding: '2rem', width: '100%' }}>
                                    <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', color: '#00ff00' }}>{">>"} SPOT THE PHISHING ATTEMPT</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left' }}>
                                        <div style={{ border: '1px solid #00ff00', padding: '1.5rem', background: '#0a0a0a', borderRadius: '4px' }}>
                                            <h3 style={{ color: '#00ff00', marginBottom: '1rem', fontSize: '1.5rem' }}>OPTION A</h3>
                                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                                <strong>From:</strong> security@gtbank-verify.com<br/>
                                                <strong>Subject:</strong> URGENT: Your Account Will Be Suspended!!!<br/><br/>
                                                Dear Valued Custumer,<br/>
                                                We detected suspicous activity on your account. Click the link below IMMEDIATELY to verify your identity or your account will be permanently locked in 24 hours.<br/><br/>
                                                <span style={{ color: '#4488ff', textDecoration: 'underline' }}>http://gtbank-secure-login.xyz/verify</span>
                                            </p>
                                        </div>
                                        <div style={{ border: '1px solid #00ff00', padding: '1.5rem', background: '#0a0a0a', borderRadius: '4px' }}>
                                            <h3 style={{ color: '#00ff00', marginBottom: '1rem', fontSize: '1.5rem' }}>OPTION B</h3>
                                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                                <strong>From:</strong> no-reply@gtbank.com<br/>
                                                <strong>Subject:</strong> Your Monthly Statement is Ready<br/><br/>
                                                Dear Customer,<br/>
                                                Your account statement for January 2026 is now available. Log in to your GTBank internet banking portal to view your statement.<br/><br/>
                                                <span style={{ color: '#4488ff', textDecoration: 'underline' }}>https://ibank.gtbank.com/statements</span>
                                            </p>
                                        </div>
                                    </div>
                                    <p style={{ marginTop: '1.5rem', fontSize: '1.3rem', color: '#888' }}>Select your answer and red flags on your phone</p>
                                </div>
                            ) : activity === 'misinformation' ? (
                                <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '900px' }}>
                                    <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', color: '#00ff00' }}>{">>"} BREAKING NEWS</h2>
                                    <div style={{ border: '2px solid #ff4444', padding: '2.5rem', background: '#0a0a0a', marginBottom: '1.5rem', borderRadius: '4px' }}>
                                        <p style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: '1.4', color: 'white', fontFamily: 'Georgia, serif' }}>
                                            "Nigerian Government Announces Free Laptops for All Secondary School Students Starting Next Week"
                                        </p>
                                        <p style={{ fontSize: '1rem', color: '#888', marginTop: '1rem' }}>Source: NaijaNewsDaily.com.ng &nbsp;|&nbsp; Published: 2 hours ago</p>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', color: '#00ff00' }}>Would you share this headline? Answer on your phone.</p>
                                </div>
                            ) : activity === 'verdict-vote' ? (
                                <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '900px' }}>
                                    <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', color: '#00ff00' }}>{">>"} CASE STUDY</h2>
                                    <div style={{ border: '1px solid #00ff00', padding: '2.5rem', background: '#0a0a0a', textAlign: 'left', marginBottom: '1.5rem', borderRadius: '4px' }}>
                                        <p style={{ fontSize: '1.6rem', lineHeight: '1.8', color: 'white' }}>
                                            A secondary school student shared a private screenshot of a classmate in a 200-person WhatsApp group. The image spread to other schools and the classmate was severely bullied and stopped attending school.
                                        </p>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', color: '#00ff00' }}>What should be the consequence? Vote on your phone.</p>
                                </div>
                            ) : activity === 'real-or-ai' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '1rem' }}>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '0.3rem', color: '#00ff00', flexShrink: 0 }}>
                                        🖼️ REAL OR AI? — Round {imageIndex + 1} of 6
                                    </h2>
                                    <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '0.5rem', flexShrink: 0 }}>Which image is AI-generated? Vote on your phone!</p>
                                    <div style={{ flex: 1, display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 0, padding: '0.5rem 1rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                                            <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#00ff00' }}>IMAGE A</h3>
                                            <img src={leftImage} alt="Image A" style={{ maxWidth: '100%', maxHeight: 'calc(100% - 3rem)', objectFit: 'contain', borderRadius: '8px', border: '3px solid #00ff00' }} />
                                        </div>
                                        <div style={{ width: '3px', background: '#00ff00', alignSelf: 'stretch', margin: '2rem 0', opacity: 0.5 }} />
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                                            <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#00ff00' }}>IMAGE B</h3>
                                            <img src={rightImage} alt="Image B" style={{ maxWidth: '100%', maxHeight: 'calc(100% - 3rem)', objectFit: 'contain', borderRadius: '8px', border: '3px solid #00ff00' }} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="blink" style={{ fontSize: '1.5rem', textAlign: 'center' }}>
                                    COLLECTING RESPONSES...<br/>
                                    <span style={{ fontSize: '1rem', color: '#555' }}>Results will appear when revealed by facilitator</span>
                                </div>
                            )
                        ) : (
                            <p style={{ fontSize: '1.5rem' }}>AWAITING_SIGNAL_FROM_CONTROL...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
