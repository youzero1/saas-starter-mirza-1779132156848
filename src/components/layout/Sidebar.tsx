import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, PlusCircle } from 'lucide-react';
import styles from '@/components/layout/Sidebar.module.css';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/listings/new', label: 'Post a Job', icon: PlusCircle },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Briefcase size={22} color="var(--color-primary)" />
        <span className={styles.logoText}>JobBoard</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        <span className={styles.version}>v1.0.0</span>
      </div>
    </aside>
  );
}
