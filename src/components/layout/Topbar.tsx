import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/components/layout/Topbar.module.css';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <span className={styles.greeting}>
          Welcome back, <strong>{user ? user.name.split(' ')[0] : 'there'}</strong>
        </span>
      </div>
      <div className={styles.right}>
        {user && (
          <div className={styles.avatar} title={user.name}>
            {user.avatar}
          </div>
        )}
        <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
