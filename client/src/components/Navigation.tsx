import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Menu, X, RefreshCw } from "lucide-react";

export const Navigation: React.FC = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Don't show nav on login or projector pages
    if (location.pathname === "/login" || location.pathname === "/projector") return null;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <nav style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            padding: "10px 20px",
            background: "rgba(0, 0, 0, 0.9)",
            borderBottom: "1px solid #00ff00",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1000,
            boxSizing: "border-box"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Link to="/lobby" style={{ color: "#00ff00", textDecoration: "none", fontWeight: "bold", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    SID_SYSTEM
                </Link>
                <div style={{ 
                    width: "10px", 
                    height: "10px", 
                    borderRadius: "50%", 
                    background: "#00ff00", 
                    boxShadow: "0 0 10px #00ff00",
                    animation: "pulse 2s infinite"
                }} title="SYSTEM ONLINE" />
            </div>

            {/* Desktop Menu */}
            <div className="desktop-menu" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                 {isAdmin && (
                    <Link to="/dashboard" style={{ color: "#00ff00", textDecoration: "none", fontWeight: "bold" }}>
                        {">>"} ADMIN_DASHBOARD
                    </Link>
                )}
                 <span className="agent-name" style={{ color: "gray", fontSize: "0.8rem" }}>
                    AGENT: {user?.displayName ? user.displayName.toUpperCase() : user?.email?.split('@')[0].toUpperCase()}
                </span>
                <button 
                    onClick={handleLogout}
                    style={{
                        background: "transparent",
                        border: "1px solid red",
                        color: "red",
                        padding: "5px 10px",
                        fontSize: "0.8rem",
                        cursor: "pointer"
                    }}
                >
                    LOGOUT
                </button>
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                         background: "transparent",
                         border: "none",
                         color: "#00ff00",
                         cursor: "pointer",
                         display: "flex",
                         alignItems: "center"
                    }}
                    title="FORCE REFRESH"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

             {/* Mobile Menu Toggle */}
             <div className="mobile-toggle" style={{ display: "none" }}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: "none", border: "none", color: "#00ff00" }}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Dropdown - Simplified for inline style, would ideally be CSS class */}
            {isMenuOpen && (
                <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    background: "black",
                    borderBottom: "1px solid #00ff00",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px"
                }}>
                    <Link to="/lobby" onClick={() => setIsMenuOpen(false)} style={{ color: "#00ff00", textDecoration: "none" }}>LOBBY</Link>
                    {isAdmin && (
                         <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} style={{ color: "#00ff00", textDecoration: "none" }}>ADMIN DASHBOARD</Link>
                    )}
                    <button onClick={handleLogout} style={{ background: "red", color: "white", padding: "10px", border: "none" }}>LOGOUT</button>
                </div>
            )}
            
            <style>{`
                @media (max-width: 768px) {
                    .desktop-menu { display: none !important; }
                    .mobile-toggle { display: block !important; }
                    .agent-name { display: none !important; }
                }
            `}</style>
        </nav>
    );
};
