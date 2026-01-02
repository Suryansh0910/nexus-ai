import { useState, useEffect } from 'react';
import './index.css';
import './App.css';
import Sidebar from '../component/sideBar';
import Main from '../component/main';
import AuthModal from '../component/AuthModal';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userData');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user data");
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const handleLogin = (userData: any) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <div className="app-container">
      <Sidebar
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      <Main />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
