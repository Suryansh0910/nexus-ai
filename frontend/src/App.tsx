import { useState, useEffect } from 'react'
import './index.css'
import './App.css'
import Sidebar from '../component/sideBar'
import Main from '../component/main'
import AuthModal from '../component/AuthModal'

function App() {
  let [modal, setModal] = useState(false)
  let [isL, setIsL] = useState(true)
  let [u, setU] = useState<any>(null)
  let [sid, setSid] = useState(0)
  let [sel, setSel] = useState<any>(null)
  let [ref, setRef] = useState(0)

  useEffect(() => {
    let t = localStorage.getItem('token')
    let d = localStorage.getItem('userData')
    if (t && d) setU(JSON.parse(d))
  }, [])

  function onIn(data: any) {
    localStorage.setItem('userData', JSON.stringify(data))
    setU(data)
    setSel(null)
    setSid(p => p + 1)
    setModal(false)
  }

  function onOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    setU(null)
    setSel(null)
    setSid(p => p + 1)
  }

  return (
    <div className="appContainer">
      <Sidebar user={u} onLogout={onOut} onNewChat={() => { setSel(null); setSid(p => p + 1) }} onSelectChat={(c: any) => { setSel(c); setSid(p => p + 1) }} refreshTrigger={ref} />
      <Main key={sid} user={u} openAuth={(l: any) => { setIsL(l); setModal(true) }} loadedChat={sel} onChatSaved={() => setRef(p => p + 1)} onNewChat={() => { setSel(null); setSid(p => p + 1) }} />
      <AuthModal open={modal} close={() => setModal(false)} onLogin={onIn} startWithLogin={isL} />
    </div>
  )
}

export default App
