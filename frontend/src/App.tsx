import { useState, useEffect } from 'react'
import './index.css'
import './App.css'
import Sidebar from '../component/sideBar'
import Main from '../component/main'
import AuthModal from '../component/AuthModal'

function App() {
  let [modal, setModal] = useState(false)
  let [isLogin, setIsLogin] = useState(true)
  let [user, setUser] = useState<any>(null)

  useEffect(() => {
    let t = localStorage.getItem('token')
    let u = localStorage.getItem('userData')
    if (t && u) setUser(JSON.parse(u))
  }, [])

  function handleLogin(data: any) {
    localStorage.setItem('userData', JSON.stringify(data))
    setUser(data)
    setModal(false)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    setUser(null)
  }

  function openModal(login: boolean) {
    setIsLogin(login)
    setModal(true)
  }

  return (
    <div className="app-container">
      <Sidebar user={user} onLogout={handleLogout} />
      <Main user={user} openAuth={openModal} />
      <AuthModal
        open={modal}
        close={() => setModal(false)}
        onLogin={handleLogin}
        startWithLogin={isLogin}
      />
    </div>
  )
}

export default App
