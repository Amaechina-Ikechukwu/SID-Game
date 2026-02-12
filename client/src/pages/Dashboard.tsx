import React, { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { doc, setDoc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useToast } from "../context/ToastContext";
import { ResultsView } from "../components/projector/ResultsView";

export const Dashboard: React.FC = () => {
  const { currentActivity, imageIndex } = useGame();
  const { showToast } = useToast();
  const [launching, setLaunching] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; message: string; action: () => void } | null>(null);
  const [chartFullscreen, setChartFullscreen] = useState(false);

  const activities = [
    { id: "password-poll", title: "01_PASSWORD_HYGIENE" },
    { id: "phishing", title: "02_PHISHING_SIMULATION" },
    { id: "tracking-poll", title: "03_APP_TRACKING" },
    { id: "real-or-ai", title: "04_AI_VERIFICATION" },
    { id: "misinformation", title: "05_INFO_INTEGRITY" },
    { id: "verdict-vote", title: "06_FINAL_VERDICT" }
  ];

  // Live Count Listener
  useEffect(() => {
    if (!currentActivity || currentActivity === 'none') {
        setLiveCount(0);
        return;
    }

    const unsub = onSnapshot(collection(db, "sessions", "default-session", "activities", currentActivity, "responses"), (snap) => {
        setLiveCount(snap.size);
    });

    return () => unsub();
  }, [currentActivity]);


  const handleLaunch = (id: string) => {
      setConfirmModal({
            isOpen: true,
            message: `CONFIRM_LAUNCH: ${id}?`,
            action: () => launchActivity(id)
      });
  };

  const launchActivity = async (id: string) => {
    setLaunching(true);
    try {
      await setDoc(doc(db, "sessions", "default-session"), {
        currentActivity: id,
        status: "active",
        imageIndex: 0,
        updatedAt: new Date()
      }, { merge: true });
      showToast(`LAUNCH_SUCCESS: ${id}`, "success");
    } catch (e) {
      console.error(e);
      showToast("LAUNCH_FAILED", "error");
    } finally {
      setLaunching(false);
      setConfirmModal(null);
    }
  };

  const revealResults = async () => {
      if(currentActivity === 'none') return;
      try {
        await setDoc(doc(db, "sessions", "default-session"), {
            status: "revealing"
        }, { merge: true });
        showToast("RESULTS_REVEALED", "info");
      } catch (e) {
          console.error(e);
          showToast("REVEAL_FAILED", "error");
      }
  };

  const handleReset = () => {
      setConfirmModal({
          isOpen: true,
          message: "CONFIRM_RESET: RETURN ALL TO LOBBY?",
          action: resetSession
      });
  };

  const resetSession = async () => {
    setLaunching(true);
    try {
      await setDoc(doc(db, "sessions", "default-session"), {
        currentActivity: "none",
        status: "idle",
        updatedAt: new Date()
      }, { merge: true });
      showToast("SESSION_RESET", "warning");
    } catch (e) {
      console.error(e);
      showToast("RESET_FAILED", "error");
    } finally {
      setLaunching(false);
      setConfirmModal(null);
    }
  };

  const exportData = async () => {
      setLaunching(true);
      try {
        const allData: any = {};
        for(const act of activities) {
            const snap = await getDocs(collection(db, "sessions", "default-session", "activities", act.id, "responses"));
            allData[act.id] = snap.docs.map(d => d.data());
        }
        
        const blob = new Blob([JSON.stringify(allData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sid2026_export_${new Date().toISOString()}.json`;
        a.click();
        showToast("DATA_EXPORTED", "success");
      } catch (e) {
          console.error(e);
          showToast("EXPORT_FAILED", "error");
      } finally {
          setLaunching(false);
      }
  };

  const updateImageIndex = async (newIndex: number) => {
      if (newIndex < 0 || newIndex > 5) return;
      try {
          await setDoc(doc(db, "sessions", "default-session"), {
              imageIndex: newIndex
          }, { merge: true });
      } catch (e) {
          console.error(e);
          showToast("IMAGE_UPDATE_FAILED", "error");
      }
  };

  return (
    <div className="container" style={{ padding: "20px", position: 'relative' }}>
      
      {/* Confirmation Modal */}
      {confirmModal && confirmModal.isOpen && (
          <div style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              background: 'rgba(0,0,0,0.8)', zIndex: 3000,
              display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
              <div style={{
                  background: 'black', border: '1px solid #00ff00', padding: '30px',
                  textAlign: 'center', maxWidth: '400px'
              }}>
                  <h3 style={{ color: '#00ff00', marginBottom: '20px' }}>{confirmModal.message}</h3>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                      <button 
                          onClick={confirmModal.action}
                          style={{ padding: '10px 20px', background: '#00ff00', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                          CONFIRM
                      </button>
                      <button 
                          onClick={() => setConfirmModal(null)}
                          style={{ padding: '10px 20px', background: 'transparent', color: 'red', border: '1px solid red', cursor: 'pointer' }}
                      >
                          CANCEL
                      </button>
                  </div>
              </div>
          </div>
      )}
      {/* Fullscreen Chart Modal */}
      {chartFullscreen && currentActivity !== 'none' && (
          <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: '#000', zIndex: 5000,
              display: 'flex', flexDirection: 'column',
              padding: '20px'
          }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                  <h2 style={{ margin: 0, color: '#00ff00', fontSize: '1.6rem' }}>📊 {currentActivity.toUpperCase().replace(/-/g, ' ')} — LIVE RESULTS</h2>
                  <button
                      onClick={() => setChartFullscreen(false)}
                      style={{ padding: '10px 24px', background: 'red', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', borderRadius: '4px' }}
                  >
                      ✕ CLOSE
                  </button>
              </div>
              <div style={{ flex: 1, minHeight: 0, border: '2px solid #00ff00', borderRadius: '8px', background: '#0a0a0a', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                      <ResultsView activityId={currentActivity} status="revealing" />
                  </div>
              </div>
          </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{">>"} FACILITATOR_CONTROL</h1>
        <div style={{display:'flex', gap:'10px'}}>
            <button
                onClick={exportData}
                disabled={launching}
                style={{ padding: "10px", background: "black", color: "#00ff00", border: "1px solid #00ff00", cursor: "pointer" }}
            >
                {">>"} EXPORT_DATA
            </button>
            <button 
            onClick={handleReset}
            disabled={launching}
            style={{ padding: "10px", background: "red", color: "white", border: "1px solid white", cursor: "pointer" }}
            >
            {">>"} STOP / RESET_SESSION
            </button>
        </div>
      </div>

      <div style={{ margin: "20px 0", padding: "10px", border: "1px solid #00ff00" }}>
        <h2>ACTIVE_MODULE: <span style={{ color: currentActivity !== 'none' ? '#00ff00' : 'gray' }}>{currentActivity.toUpperCase()}</span></h2>
        {currentActivity !== 'none' && (
            <div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h3>LIVE_RESPONSES: {liveCount}</h3>
                    <button 
                        onClick={revealResults}
                        style={{ padding: "10px 20px", background: "#00ff00", color: "black", fontWeight: "bold", border: "none", cursor: "pointer" }}
                    >
                        {">>"} REVEAL_RESULTS_TO_PROJECTOR
                    </button>
                </div>
                {currentActivity === 'real-or-ai' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', padding: '10px', border: '1px dashed #00ff00' }}>
                        <span style={{ fontSize: '1rem' }}>🖼️ Image Round: <strong>{imageIndex + 1}</strong> / 6</span>
                        <button 
                            onClick={() => updateImageIndex(imageIndex - 1)} 
                            disabled={imageIndex <= 0}
                            style={{ padding: '8px 16px', background: imageIndex <= 0 ? '#333' : '#00ff00', color: imageIndex <= 0 ? '#666' : 'black', border: 'none', cursor: imageIndex <= 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                        >
                            ← PREV
                        </button>
                        <button 
                            onClick={() => updateImageIndex(imageIndex + 1)} 
                            disabled={imageIndex >= 5}
                            style={{ padding: '8px 16px', background: imageIndex >= 5 ? '#333' : '#00ff00', color: imageIndex >= 5 ? '#666' : 'black', border: 'none', cursor: imageIndex >= 5 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                        >
                            NEXT →
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div className="activity-list">
          <h3>{">>"} AVAILABLE_MODULES</h3>
          {activities.map((act) => (
            <div key={act.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px dashed #333", paddingBottom: "5px" }}>
              <span>{act.title}</span>
              <button 
                onClick={() => currentActivity === act.id ? handleReset() : handleLaunch(act.id)}
                disabled={launching || (currentActivity !== 'none' && currentActivity !== act.id)}
                style={{ 
                    background: currentActivity === act.id ? "red" : (currentActivity !== 'none' ? "gray" : "#00ff00"), 
                    color: currentActivity === act.id ? "white" : "black", 
                    border: currentActivity === act.id ? "1px solid white" : "none", 
                    padding: "5px 10px", 
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
              >
                {currentActivity === act.id ? "STOP" : "LAUNCH"}
              </button>
            </div>
          ))}
        </div>

        <div className="results-view" style={{ border: "1px dashed #00ff00", padding: "10px", height: "400px", display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{">>"}  LIVE_RESULTS_FEED</h3>
                {currentActivity !== 'none' && (
                    <button
                        onClick={() => setChartFullscreen(true)}
                        style={{ padding: '6px 14px', background: '#00ff00', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                        ⛶ FULLSCREEN
                    </button>
                )}
            </div>
            <div id="live-results" style={{ flex: 1, position: 'relative' }}>
                {currentActivity === 'none' ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <p style={{color: 'gray'}}>SYSTEM_IDLE</p>
                    </div>
                ) : (
                    <>
                         <p style={{ position: 'absolute', top: 0, right: 0, fontSize: "0.7rem", color: "#00ff00" }}>RECEPTION_STRENGTH: 100%</p>
                         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                            {/* Reusing ResultsView for live dashboard feed - passing 'revealing' status to force show */}
                            <ResultsView activityId={currentActivity} status="revealing" />
                         </div>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
