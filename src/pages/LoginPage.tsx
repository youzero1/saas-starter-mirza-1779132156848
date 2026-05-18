import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/pages/LoginPage.module.css';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Invalid credentials. Try alice@company.com, bob@company.com, or carol@company.com.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brandRow}>
          <div className={styles.brandIcon}>
            <Briefcase size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h1 className={styles.brandName}>JobBoard</h1>
            <p className={styles.brandSub}>Internal Listings Platform</p>
          </div>
        </div>

        <h2 className={styles.heading}>Sign in to your account</h2>
        <p className={styles.subheading}>Use any of the demo emails below to log in.</p>

        <div className={styles.hints}>
          <span>alice@company.com</span>
          <span>bob@company.com</span>
          <span>carol@company.com</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Email address</label>
            <input
              className={styles.input}
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                className={styles.input}
                type={showPass ? 'text' : 'password'}
                placeholder="Any password works"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass((v) => !v)}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
