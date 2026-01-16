import { useState, useEffect } from 'react'
import './AuthModal.css'

function AuthModal({ open, close, onLogin, startWithLogin = true }: any) {
    let [mode, setMode] = useState(startWithLogin)
    let [f, setF] = useState({ username: '', email: '', password: '' })
    let [err, setErr] = useState('')
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setMode(startWithLogin)
            setErr('')
            setF({ username: '', email: '', password: '' })
        }
    }, [open, startWithLogin])

    if (!open) return null

    async function sub(e: any) {
        e.preventDefault()
        setLoading(true);
        setErr('')
        let path = mode ? 'signin' : 'signup'
        let b = mode ? { username: f.username, password: f.password } : f
        const api = import.meta.env.VITE_API_URL || 'https://nexus-ai-1-3qls.onrender.com'
        try {
            let res = await fetch(`${api}/api/auth/${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(b)
            })
            let d = await res.json()
            if (res.ok) {
                localStorage.setItem('token', d.token)
                onLogin(d.user)
                close()
            } else setErr(d.msg || 'Error')
        } catch (e) {
            setErr('Server down')
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="authOverlay" onClick={close}>
            <div className="authModal" onClick={e => e.stopPropagation()}>
                <div className="authHeader">
                    <h2>{mode ? 'Login' : 'Signup'}</h2>
                    <p>{mode ? 'Welcome back!' : 'Join us!'}</p>
                </div>
                {err && <div className="errorMessage">{err}</div>}
                <form className="authForm" onSubmit={sub}>
                    <div className="formGroup">
                        <label>Username</label>
                        <input type="text" name="username" value={f.username} onChange={e => setF({ ...f, username: e.target.value })} required />
                    </div>
                    {!mode && (
                        <div className="formGroup">
                            <label>Email</label>
                            <input type="email" name="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required />
                        </div>
                    )}
                    <div className="formGroup">
                        <label>Password</label>
                        <input type="password" name="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} required />
                    </div>
                    <button type="submit" className="submitBtn">{mode ? 'In' : 'Up'}</button>
                </form>
                <div className="authFooter">
                    <button disabled={loading} onClick={() => setMode(!mode)}>{mode ? 'Signup instead' : 'Login instead'}</button>
                </div>
            </div>
        </div>
    )
}

export default AuthModal
