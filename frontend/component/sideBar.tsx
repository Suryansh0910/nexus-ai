import React from 'react';
import './sideBar.css';
import logo from "./logo.png";

interface SidebarProps {
    user?: {
        username: string;
        email: string;
    } | null;
    onOpenAuth?: () => void;
    onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onOpenAuth, onLogout }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-content">
                <div className="sidebar-top">
                    <div className="sidebar-header">
                        <div className="header-left">
                            <img src={logo} className="logo" alt="logo" />
                            <h2>Nexus AI</h2>
                        </div>
                    </div>

                    <div className="new-chat">
                        <button className="new-chat-btn">+ New Chat</button>
                    </div>

                    <div className="chat-section">
                        <h3 className="chat-title">Chat</h3>
                        <p className="chat-description">Sign in to start chatting with multiple AI model</p>
                    </div>
                </div>

                <div className="sidebar-footer">
                    {user ? (
                        <div className="user-section">
                            <button className="upgrade-btn">
                                Upgrade Plan
                            </button>

                            <div className="user-profile">
                                <div className="user-avatar">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-info">
                                    <span className="user-name">{user.username}</span>
                                    <span className="user-plan">Free Plan</span>
                                </div>
                                <button className="logout-btn" onClick={onLogout} title="Logout">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button className="signin-btn" onClick={onOpenAuth}>
                            Sign In / Sign Up
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
