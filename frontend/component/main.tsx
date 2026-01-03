import './main.css'
import { Bot, Sparkles, Brain, ChevronDown, Paperclip, Mic, Send } from 'lucide-react'

// model list for the panels
let models = [
    { id: 'gpt', name: 'GPT 4.1 Mini', icon: <Bot size={18} />, color: 'gpt-icon' },
    { id: 'gemini', name: 'Gemini 2.5 Lite', icon: <Sparkles size={18} />, color: 'gemini-icon' },
    { id: 'deepseek', name: 'DeepSeek R1', icon: <Brain size={18} />, color: 'deepseek-icon' }
]

function Main({ user, openAuth }: { user: any, openAuth: (v: boolean) => void }) {

    // show landing if not logged in
    if (!user) {
        return (
            <div className="main">
                <div className="landing-container">
                    <div className="landing-content">
                        <h1 className="landing-title">Welcome to Nexus AI</h1>
                        <p className="landing-subtitle">
                            Experience the power of multiple advanced AI models in one unified interface.
                            Sign in to start your journey where knowledge begins.
                        </p>
                        <div className="landing-buttons">
                            <button className="landing-btn signin-btn-landing" onClick={() => openAuth(true)}>
                                Sign In
                            </button>
                            <button className="landing-btn signup-btn-landing" onClick={() => openAuth(false)}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // logged in view
    return (
        <div className="main">
            <div className="split-view">
                {models.map((m, i) => (
                    <div className="split-panel" key={m.id}>
                        <div className="model-header">
                            <button className="model-dropdown">
                                <div className={`model-icon ${m.color}`}>{m.icon}</div>
                                <span>{m.name}</span>
                                <ChevronDown className="chevron" size={14} />
                            </button>
                            <div className="toggle-switch">
                                <input type="checkbox" id={`t${i}`} />
                                <label htmlFor={`t${i}`}></label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="search-container">
                <div className="search-box">
                    <button className="icon-btn attach-btn"><Paperclip size={20} /></button>
                    <input type="text" placeholder="Ask me anything..." className="search-input" />
                    <div className="search-actions">
                        <button className="icon-btn mic-btn"><Mic size={20} /></button>
                        <button className="send-btn"><Send size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
