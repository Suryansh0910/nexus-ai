import { useState, useEffect } from 'react'
import './AuthModal.css'

type Props = {
    open: boolean
    close: () => void
    onLogin: (data: any) => void
    startWithLogin?: boolean
}

function AuthModal({ open, close, onLogin, startWithLogin = true }: Props) {
    let [mode, setMode] = useState(startWithLogin)
    let [form, setForm] = useState({ username: '', email: '', password: '' })
    let [error, setError] = useState('')

    useEffect(() => {
        if (open) {
            setMode(startWithLogin)
            setError('')
            setForm({ username: '', email: '', password: '' })
        }
    }, [open, startWithLogin])

    if (!open) return null

    function update(e: any) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function submit(e: any) {
        e.preventDefault()
        setError('')

        let endpoint = mode ? 'signin' : 'signup'
        let body = mode ? { email: form.email, password: form.password } : form

        try {
            let res = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            let data = await res.json()

            if (res.ok) {
                localStorage.setItem('token', data.token)
                onLogin(data.user)
                close()
            } else {
                setError(data.msg || 'Something went wrong')
            }
        } catch (err) {
            setError('Cant connect to server')
        }
    }

    return (
        <div className="auth-overlay" onClick={close}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={close}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                </button>

                <div className="auth-header">
                    <h2>{mode ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{mode ? 'Sign in to continue to Nexus AI' : 'Join Nexus AI today'}</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={submit}>
                    {!mode && (
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" name="username" placeholder="Enter username"
                                value={form.username} onChange={update} required />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" placeholder="Enter email"
                            value={form.email} onChange={update} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Enter password"
                            value={form.password} onChange={update} required />
                    </div>

                    <button type="submit" className="submit-btn">
                        {mode ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    {mode ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setMode(!mode)}>
                        {mode ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AuthModal
