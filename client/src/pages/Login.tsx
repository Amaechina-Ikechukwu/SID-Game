import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegistering) {
        if (!displayName) throw new Error("DISPLAY_NAME_REQUIRED");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/lobby");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "2px solid #00ff00", borderRadius: "8px" }}>
      <h1 style={{ fontSize: "clamp(1.2rem, 5vw, 1.8rem)", marginBottom: "20px", wordBreak: "break-word" }}>
        {isRegistering ? "🆕 New Registration" : "🔒 Login"}
      </h1>
      {error && <p style={{ color: "red" }}>ERROR: {error}</p>}
      <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {isRegistering && (
            <input
            type="text"
            placeholder="Your Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{ padding: "12px", background: "black", color: "#00ff00", border: "1px solid #00ff00", fontSize: "1rem", borderRadius: "6px" }}
            />
        )}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "12px", background: "black", color: "#00ff00", border: "1px solid #00ff00", fontSize: "1rem", borderRadius: "6px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "12px", background: "black", color: "#00ff00", border: "1px solid #00ff00", fontSize: "1rem", borderRadius: "6px" }}
        />
        <button type="submit" style={{ padding: "14px", background: "#00ff00", color: "black", fontWeight: "bold", border: "none", cursor: "pointer", fontSize: "1.1rem", borderRadius: "6px" }}>
          {isRegistering ? "Sign Up" : "Login"}
        </button>
      </form>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ background: "transparent", color: "#00ff00", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: "0.9rem" }}
        >
            {isRegistering ? "← Back to Login" : "Create an Account →"}
        </button>
      </div>
    </div>
  );
};
