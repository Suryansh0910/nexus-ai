import { useState, useEffect } from 'react'
import { LogOut, MessageSquare, Trash2 } from 'lucide-react'
import './sideBar.css'
import logo from './logo.png'

function Sidebar({ user, onLogout, onNewChat, onSelectChat, refreshTrigger }: any) {
    const [chats, setChats] = useState<any[]>([])
    const [delId, setDelId] = useState<string | null>(null)

    useEffect(() => {
        if (user) load()
        else setChats([])
    }, [user, refreshTrigger])

    async function load() {
        const t = localStorage.getItem('token')
        if (!t) return
        try {
            const res = await fetch('http://localhost:3000/api/chat', {
                headers: { 'x-auth-token': t }
            })
            const data = await res.json()
            if (Array.isArray(data)) setChats(data)
        } catch (err) {
            console.log('Load error', err)
        }
    }

    async function confirmDelete() {
        if (!delId) return
        const t = localStorage.getItem('token')
        try {
            const res = await fetch(`http://localhost:3000/api/chat/${delId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': t || '' }
            })
            if (res.ok) setChats(chats.filter(c => c._id !== delId))
        } catch (err) {
            console.log(err)
        } finally {
            setDelId(null)
        }
    }

    return (
        <div className="sidebar">
            <div className="sidebarContent">
                <div className="sidebarTop">
                    <div className="sidebarHeader">
                        <div className="headerLeft">
                            <img src={logo} className="logo" alt="logo" />
                            <h2>Nexus AI</h2>
                        </div>
                    </div>
                    <div className="newChat">
                        <button className="newChatBtn" onClick={onNewChat}>+ New Chat</button>
                    </div>
                    <div className="chatSection">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h3 className="chatTitle">Saved Chats</h3>
                            <span style={{ color: '#666', fontSize: '0.75rem' }}>{5 - chats.length} remaining</span>
                        </div>
                        <div className="chatList">
                            {chats.map(c => (
                                <div key={c._id} className="chatItemContainer">
                                    <button className="chatItem" onClick={() => onSelectChat(c)}>
                                        <MessageSquare size={16} />
                                        <span className="chatTitleText">{c.title}</span>
                                    </button>
                                    <button className="deleteBtn" onClick={(e) => { e.stopPropagation(); setDelId(c._id) }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {chats.length === 0 && <p className="chatDescription">No chats</p>}
                        </div>
                    </div>
                </div>

                <div className="sidebarFooter">
                    {user && (
                        <div className="userSection">
                            <div className="userProfile">
                                <div className="userAvatar">{user.username.charAt(0).toUpperCase()}</div>
                                <div className="userInfo">
                                    <span className="userName">{user.username}</span>
                                </div>
                                <button className="logoutBtn" onClick={onLogout} title="Logout">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {delId && (
                <div className="deleteModalOverlay">
                    <div className="deleteModal">
                        <h3>Delete?</h3>
                        <p>This will permanently delete it.</p>
                        <div className="deleteModalActions">
                            <button className="deleteModalBtn deleteModalCancel" onClick={() => setDelId(null)}>Cancel</button>
                            <button className="deleteModalBtn deleteModalConfirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar
