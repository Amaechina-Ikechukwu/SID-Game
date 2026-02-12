import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CyberBarChart, CyberDonutChart, CyberGroupedBarChart } from './ProjectorCharts';

const IMAGE_PAIRS_ANSWERS = [
    { realSide: 'A' }, { realSide: 'B' }, { realSide: 'A' },
    { realSide: 'B' }, { realSide: 'A' }, { realSide: 'B' },
];

interface ResultsViewProps {
    activityId: string;
    status: string;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ activityId, status }) => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (!activityId || activityId === 'none') return;

        console.log(`Subscribing to results for: ${activityId}`);
        const q = query(collection(db, "sessions", "default-session", "activities", activityId, "responses"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const responses: any[] = [];
            snapshot.forEach(doc => responses.push(doc.data()));
            processData(activityId, responses);
        });

        return () => unsubscribe();
    }, [activityId]);

    const processData = (id: string, responses: any[]) => {
        let processed: any[] = [];

        switch (id) {
            case 'password-poll':
                 // Password poll stores q0, q1, q2 fields with 'yes'/'no' values
                 const questions = [
                     { key: 'q0', label: 'Same password?' },
                     { key: 'q1', label: 'Name/birthday?' },
                     { key: 'q2', label: 'Changed recently?' }
                 ];
                 processed = questions.map(q => {
                     let yes = 0, no = 0;
                     responses.forEach(r => {
                         if (r[q.key] === 'yes') yes++;
                         else if (r[q.key] === 'no') no++;
                     });
                     return { name: q.label, YES: yes, NO: no };
                 }).filter(q => q.YES > 0 || q.NO > 0);
                 break;

            case 'tracking-poll':
                const counts: Record<string, number> = { delete: 0, settings: 0, ignore: 0, report: 0 };
                responses.forEach(r => {
                    const val = r.option || r.answer; // Fallback
                    if (counts[val] !== undefined) counts[val]++;
                });
                processed = Object.keys(counts).map(k => ({ name: k.toUpperCase(), value: counts[k] }));
                break;

            case 'phishing':
                const phishCounts: Record<string, number> = { A: 0, B: 0 };
                responses.forEach(r => {
                    const val = r.choice || r.answer;
                    if (phishCounts[val] !== undefined) phishCounts[val]++;
                });
                processed = Object.keys(phishCounts).map(k => ({ name: `OPTION ${k}`, value: phishCounts[k] }));
                break;
            
            case 'real-or-ai':
                // Per-round correct vs wrong counts
                for (let round = 0; round < 6; round++) {
                    const correctAnswer = IMAGE_PAIRS_ANSWERS[round].realSide === 'A' ? 'B' : 'A';
                    let correct = 0, wrong = 0;
                    responses.forEach(r => {
                        const vote = r[`vote_${round}`];
                        if (vote) {
                            if (vote === correctAnswer) correct++;
                            else wrong++;
                        }
                    });
                    if (correct > 0 || wrong > 0) {
                        processed.push({ name: `Round ${round + 1}`, CORRECT: correct, WRONG: wrong });
                    }
                }
                break;

            case 'misinformation':
                const shareCounts: Record<string, number> = { 'YES_SHARE': 0, 'NO_SHARE': 0 };
                responses.forEach(r => {
                     if (r.share === true) shareCounts['YES_SHARE']++;
                     else if (r.share === false) shareCounts['NO_SHARE']++;
                });
                processed = Object.keys(shareCounts).map(k => ({ name: k, value: shareCounts[k] }));
                break;

            case 'verdict-vote':
                 const voteCounts: Record<string, number> = { expel: 0, warning: 0, police: 0, none: 0 };
                 responses.forEach(r => {
                     const val = r.verdict;
                     if (val && voteCounts[val] !== undefined) voteCounts[val]++;
                 });
                 processed = Object.keys(voteCounts).map(k => ({ name: k.toUpperCase(), value: voteCounts[k] }));
                 break;
                 
            default:
                processed = [];
        }
        setData(processed);
    };

    // If we are in Dashboard (no status prop passed usually, or ignore it), show live.
    // Logic: If status is 'revealing' OR 'closed', show. 
    // OR if activity is 'tracking-poll' (always live).
    // User wants "live update".
    
    // We will control visibility via CSS or parent. 
    // IF the parent *wants* to hide it, they shouldn't render ResultsView.
    // BUT Projector uses this. Projector hides it if not revealing.
    
    // Modification: Projector logic for hiding is:
    // if (status !== 'revealing' && status !== 'closed' && activityId !== 'tracking-poll')
    
    // We will leave the component pure: it just renders data.
    // The VISIBILITY logic belongs in Projector.tsx or Dashboard.tsx.
    // So I will remove the "AWAITING_REVEAL" check from here and let the parent handle it.
    // This allows Dashboard to reuse this component for live preview.
    
    /* 
    if (status !== 'revealing' && status !== 'closed' && activityId !== 'tracking-poll') {
         return <div className="blink">AWAITING_REVEAL...</div>;
    }
    */

    if (data.length === 0) return <div style={{ fontSize: '1.5rem' }}>COLLECTING RESPONSES...</div>;

    const totalResponses = data.reduce((sum: number, d: any) => sum + (d.value || d.YES || 0) + (d.NO || 0), 0);

    const getSummary = (id: string, d: any[]): string => {
        switch (id) {
            case 'password-poll': {
                const q0 = d.find(q => q.name === 'Same password?');
                if (q0 && (q0.YES + q0.NO) > 0) {
                    const pct = Math.round((q0.YES / (q0.YES + q0.NO)) * 100);
                    return `${pct}% of participants reuse passwords across accounts. Password reuse is one of the top causes of account compromise — if one service is breached, all your accounts are at risk.`;
                }
                return 'Results show common password hygiene habits in the room. Strong, unique passwords for every account are your first line of defence.';
            }
            case 'tracking-poll': {
                const max = d.reduce((a: any, b: any) => a.value > b.value ? a : b, d[0]);
                return `Most popular response: "${max.name}" — The best practice is to revoke permissions in settings. Deleting the app doesn't always stop tracking, and ignoring it puts your location data at risk. Always review app permissions regularly.`;
            }
            case 'phishing': {
                const optA = d.find(q => q.name === 'OPTION A');
                const optB = d.find(q => q.name === 'OPTION B');
                const total = (optA?.value || 0) + (optB?.value || 0);
                if (total > 0) {
                    const correctPct = Math.round(((optA?.value || 0) / total) * 100);
                    return `${correctPct}% correctly identified Option A as the phishing attempt. Key red flags: suspicious domain (@gtbank-verify.com), urgent threatening language, spelling errors ("Custumer", "suspicous"), and a suspicious link (.xyz domain).`;
                }
                return 'Look for red flags: suspicious sender addresses, urgent language, grammar errors, and unexpected links.';
            }
            case 'misinformation': {
                const yesShare = d.find(q => q.name === 'YES_SHARE');
                const noShare = d.find(q => q.name === 'NO_SHARE');
                const total = (yesShare?.value || 0) + (noShare?.value || 0);
                if (total > 0) {
                    const sharePct = Math.round(((yesShare?.value || 0) / total) * 100);
                    return `${sharePct}% said they would share this headline. This headline is FAKE. Always verify before sharing: check the source, look for the story on established news sites, and be wary of headlines that sound too good to be true.`;
                }
                return 'This headline is fabricated. Misinformation spreads when people share without verifying. Always check multiple sources before sharing news.';
            }
            case 'verdict-vote': {
                const max = d.reduce((a: any, b: any) => a.value > b.value ? a : b, d[0]);
                return `The room's top choice: "${max.name}". There is no single right answer — but sharing private images without consent can be a criminal offence under Nigeria's Cybercrimes Act. Both the school and law enforcement may have roles to play in protecting the victim.`;
            }
            case 'real-or-ai': {
                const totalVotes = d.reduce((s: number, r: any) => s + (r.CORRECT || 0) + (r.WRONG || 0), 0);
                const totalCorrect = d.reduce((s: number, r: any) => s + (r.CORRECT || 0), 0);
                if (totalVotes > 0) {
                    const accuracy = Math.round((totalCorrect / totalVotes) * 100);
                    return `${accuracy}% of votes correctly identified the AI-generated image. AI images are getting harder to spot — look for unnatural lighting, distorted hands, inconsistent shadows, and overly smooth textures.`;
                }
                return 'AI-generated images are becoming harder to detect. Look for subtle tells: unnatural lighting, distorted hands/fingers, inconsistent shadows, and overly smooth skin textures.';
            }
            default:
                return '';
        }
    };

    const summary = getSummary(activityId, data);

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                {activityId === 'password-poll' ? (
                    <CyberGroupedBarChart data={data} keys={['YES', 'NO']} />
                ) : activityId === 'tracking-poll' || activityId === 'verdict-vote' ? (
                    <CyberBarChart data={data} />
                ) : activityId === 'real-or-ai' ? (
                    <CyberGroupedBarChart data={data} keys={['CORRECT', 'WRONG']} colors={['#00ff00', '#ff4444']} />
                ) : (
                    <CyberDonutChart data={data} />
                )}
                </div>
            </div>
            {summary && (
                <div style={{
                    padding: '20px 30px',
                    borderTop: '1px solid #00ff00',
                    background: 'rgba(0, 255, 0, 0.03)',
                    marginTop: '10px',
                    flexShrink: 0
                }}>
                    <p style={{
                        color: '#00ff00',
                        fontFamily: 'Courier Prime, monospace',
                        fontSize: '1.2rem',
                        lineHeight: '1.6',
                        textAlign: 'center',
                        margin: 0
                    }}>
                        📊 {summary}
                    </p>
                    {activityId !== 'real-or-ai' && (
                        <p style={{ color: '#555', fontFamily: 'Courier Prime, monospace', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px' }}>
                            Total responses: {totalResponses}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
