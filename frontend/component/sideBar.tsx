import { LogOut } from 'lucide-react'
import './sideBar.css'
import logo from './logo.png'

type Props = {
    user: { username: string, email: string } | null
    onLogout: () => void
}

function Sidebar({ user, onLogout }: Props) {
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
                    {user && (
                        <div className="user-section">
                            <button className="upgrade-btn">Upgrade Plan</button>
                            <div className="user-profile">
                                <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                                <div className="user-info">
                                    <span className="user-name">{user.username}</span>
                                    <span className="user-plan">Free Plan</span>
                                </div>
                                <button className="logout-btn" onClick={onLogout} title="Logout">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
