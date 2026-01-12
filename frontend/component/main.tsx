import { useState } from 'react'
import './main.css'
import { Bot, Sparkles, Brain, Plus, Send, Loader2, Save, AlertCircle, CheckCircle, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

let models = [
    { id: 'gpt', name: 'Mistral Dev', icon: <Bot size={18} />, color: 'gptIcon' },
    { id: 'gemini', name: 'Nvidia Nemotron', icon: <Sparkles size={18} />, color: 'geminiIcon' },
    { id: 'deepseek', name: 'DeepSeek R1', icon: <Brain size={18} />, color: 'deepseekIcon' }
]

function Main({ user, openAuth, loadedChat, onChatSaved, onNewChat }: any) {
    let [input, setInput] = useState(loadedChat?.interactions?.[loadedChat.interactions.length - 1]?.prompt || '')
    let [gptRes, setGptRes] = useState(loadedChat?.interactions?.[loadedChat.interactions.length - 1]?.responses?.gpt || '')
    let [gemRes, setGemRes] = useState(loadedChat?.interactions?.[loadedChat.interactions.length - 1]?.responses?.gemini || '')
    let [dsRes, setDsRes] = useState(loadedChat?.interactions?.[loadedChat.interactions.length - 1]?.responses?.deepseek || '')
    let [loading, setLoading] = useState(false)
    let [chatId, setChatId] = useState(loadedChat?._id || null)
    let [lastPrompt, setLastPrompt] = useState(loadedChat?.interactions?.[loadedChat.interactions.length - 1]?.prompt || '')
    let [toast, setToast] = useState<any>(null)
    let [enabled, setEnabled] = useState<any>({ gpt: true, gemini: true, deepseek: true })

    function showToast(msg: string, type: 'success' | 'error') {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    async function sendMessage() {
        if (!input.trim()) return
        setLoading(true)
        setLastPrompt(input)
        setGptRes('')
        setGemRes('')
        setDsRes('')

        const parse = (data: any) => {
            if (data.error) return `Error: ${data.error.message}`
            const msg = data.choices?.[0]?.message
            if (!msg) return 'Error: No respond'
            let out = ''
            const reasoning = msg.reasoning || msg.reasoning_details
            if (reasoning) out += `> **Thinking:**\n> ${reasoning.replace(/\n/g, '\n> ')}\n\n`
            return out + (msg.content || '')
        }

        const runFetch = async (id: string, model: string, token: string, setter: any) => {
            if (!enabled[id]) return
            try {
                const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:5173",
                        "X-Title": "Nexus AI"
                    },
                    body: JSON.stringify({
                        model,
                        messages: [{ role: "user", content: input }],
                        reasoning: { enabled: true }
                    })
                })
                // ... (rest of the function remains similar)
                if (res.status === 401) {
                    setter('Error: Invalid API Key (401)')
                    return
                }

                const data = await res.json()
                if (data.error) {
                    setter(`Error: ${data.error.message || 'Check API Key'}`)
                } else {
                    setter(parse(data))
                }
            } catch (err) {
                setter('Connection error')
            }
        }

        const key1 = import.meta.env.VITE_MISTRAL_KEY
        const key2 = import.meta.env.VITE_NVIDIA_KEY
        const key3 = import.meta.env.VITE_DEEPSEEK_KEY

        await Promise.all([
            runFetch('gpt', 'mistralai/mistral-7b-instruct:free', key1, setGptRes),
            runFetch('gemini', 'nvidia/nemotron-3-nano-30b-a3b:free', key2, setGemRes),
            runFetch('deepseek', 'deepseek/deepseek-r1', key3, setDsRes)
        ])
        setLoading(false)
    }

    async function saveChat() {
        if (!user) return showToast('Login to save', 'error')
        const p = lastPrompt || input
        const t = localStorage.getItem('token')
        if (!t || !p) return

        try {
            const api = import.meta.env.VITE_API_URL || 'https://nexus-ai-1-3qls.onrender.com'
            const res = await fetch(`${api}/api/chat/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': t },
                body: JSON.stringify({
                    chatId,
                    prompt: p,
                    responses: { deepseek: dsRes, gpt: gptRes, gemini: gemRes }
                })
            })
            const data = await res.json()
            if (data._id) {
                setChatId(data._id)
                if (onChatSaved) onChatSaved()
            }
        } catch (e) {
            showToast('Save failed', 'error')
        }
    }

    if (!user) {
        return (
            <div className="main">
                <div className="landingContainer">
                    <div className="landingContent">
                        <h1 className="landingTitle">Welcome to Nexus AI</h1>
                        <p className="landingSubtitle">Multiple AIs. One place.</p>
                        <div className="landingButtons">
                            <button className="landingBtn signinBtnLanding" onClick={() => openAuth(true)}>Sign In</button>
                            <button className="landingBtn signupBtnLanding" onClick={() => openAuth(false)}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="main">
            <div className="splitView">
                {models.map((m, i) => (
                    <div className="splitPanel" key={m.id}>
                        <div className="modelHeader">
                            <div className="modelDropdown">
                                <div className={`modelIcon ${m.color}`}>{m.icon}</div>
                                <span>{m.name}</span>
                            </div>
                            <div className="toggleSwitch">
                                <input type="checkbox" id={`t${i}`} checked={enabled[m.id]} onChange={(e) => setEnabled({ ...enabled, [m.id]: e.target.checked })} />
                                <label htmlFor={`t${i}`}></label>
                            </div>
                        </div>

                        <div className="chatArea">
                            {loading && enabled[m.id] && !(m.id === 'gpt' ? gptRes : m.id === 'gemini' ? gemRes : dsRes) && (
                                <div className="loadingMsg">
                                    <Loader2 className="spin" size={16} />
                                    <span>Thinking...</span>
                                </div>
                            )}
                            {((m.id === 'gpt' ? gptRes : m.id === 'gemini' ? gemRes : dsRes)) && (
                                <div className="aiMessage">
                                    <div className="msgIcon">{m.icon}</div>
                                    <div className="msgText">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {m.id === 'gpt' ? gptRes : m.id === 'gemini' ? gemRes : dsRes}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}
                            {!loading && !(m.id === 'gpt' ? gptRes : m.id === 'gemini' ? gemRes : dsRes) && (
                                <div className="emptyChat">Ask {m.name} something!</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="searchContainer">
                <div className="searchBox">
                    <button className="iconBtn attachBtn" onClick={onNewChat} title="New Chat"><Plus size={20} /></button>
                    <input
                        type="text"
                        placeholder="Ask anything..."
                        className="searchInput"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                sendMessage()
                            }
                        }}
                    />
                    <div className="searchActions">
                        <button className="iconBtn saveBtn" onClick={saveChat} title="Save Chat"><Save size={20} /></button>
                        <button className="sendBtn" onClick={sendMessage} disabled={loading}>
                            {loading ? <Loader2 className="spin" size={16} /> : <Send size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {toast && (
                <div className={`toastNotification toast-${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{toast.msg}</span>
                    <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '10px' }}><X size={14} /></button>
                </div>
            )}
        </div>
    )
}

export default Main
