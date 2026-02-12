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
    <div className="container" style={{ 
      maxWidth: "420px", 
      margin: "80px auto", 
      padding: "40px 30px", 
      border: "2px solid #00ff00", 
      borderRadius: "12px",
      boxShadow: "0 0 30px rgba(0, 255, 0, 0.15)",
      background: "rgba(0, 0, 0, 0.8)"
    }}>
      <h1 style={{ 
        fontSize: "clamp(1.5rem, 5vw, 2rem)", 
        marginBottom: "8px", 
        fontWeight: "600",
        letterSpacing: "-0.02em",
        textAlign: "center"
      }}>
        {isRegistering ? "Create Account" : "Welcome Back"}
      </h1>
      <p style={{ 
        textAlign: "center", 
        color: "#888", 
        fontSize: "0.95rem", 
        marginBottom: "30px"
      }}>
        {isRegistering ? "Join the SID2026 event" : "Sign in to continue"}
      </p>
      {error && <p style={{ color: "red" }}>ERROR: {error}</p>}
      <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {isRegistering && (
            <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            style={{ 
              padding: "14px 16px", 
              background: "#0a0a0a", 
              color: "#00ff00", 
              border: "1px solid #333", 
              fontSize: "1rem", 
              borderRadius: "8px",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#00ff00"}
            onBlur={(e) => e.target.style.borderColor = "#333"}
            />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ 
            padding: "14px 16px", 
            background: "#0a0a0a", 
            color: "#00ff00", 
            border: "1px solid #333", 
            fontSize: "1rem", 
            borderRadius: "8px",
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#00ff00"}
          onBlur={(e) => e.target.style.borderColor = "#333"}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ 
            padding: "14px 16px", 
            background: "#0a0a0a", 
            color: "#00ff00", 
            border: "1px solid #333", 
            fontSize: "1rem", 
            borderRadius: "8px",
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#00ff00"}
          onBlur={(e) => e.target.style.borderColor = "#333"}
        />
        <button 
          type="submit" 
          style={{ 
            padding: "16px", 
            background: "#00ff00", 
            color: "#000", 
            fontWeight: "600", 
            border: "none", 
            cursor: "pointer", 
            fontSize: "1.05rem", 
            borderRadius: "8px",
            transition: "all 0.2s",
            marginTop: "8px"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#00dd00"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#00ff00"}
        >
          {isRegistering ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <button 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ 
              background: "transparent", 
              color: "#00ff00", 
              border: "none", 
              cursor: "pointer", 
              fontSize: "0.95rem",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#00dd00"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#00ff00"}
        >
            {isRegistering ? "Already have an account? Sign in" : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
};
