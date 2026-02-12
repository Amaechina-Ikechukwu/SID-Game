import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

interface GameContextType {
  currentActivity: string;
  sessionStatus: string;
  imageIndex: number;
}

const GameContext = createContext<GameContextType>({
  currentActivity: "none",
  sessionStatus: "idle",
  imageIndex: 0,
});

export const useGame = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentActivity, setCurrentActivity] = useState<string>("none");
  const [sessionStatus, setSessionStatus] = useState<string>("idle");
  const [imageIndex, setImageIndex] = useState<number>(0);

  useEffect(() => {
    console.log(">> GAME_CONTEXT_INIT: Listening to default-session");
    const unsub = onSnapshot(doc(db, "sessions", "default-session"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const activity = data.currentActivity || "none";
        const status = data.status || "idle";

        setCurrentActivity(activity);
        setSessionStatus(status);
        setImageIndex(data.imageIndex || 0);

        console.log(`>> SESSION_UPDATE: Activity=${activity}, Status=${status}, ImageIndex=${data.imageIndex || 0}`);
      }
    });

    return () => unsub();
  }, []);

  return (
    <GameContext.Provider value={{ currentActivity, sessionStatus, imageIndex }}>
      {children}
    </GameContext.Provider>
  );
};
