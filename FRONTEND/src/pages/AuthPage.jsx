import { useState } from 'react';
import './AuthPage.css';

export default function AuthPage() {
  const [tab, setTab] = useState('login');

  return (
    <main className="container page-space auth-page">
      <div className={`auth-shell ${tab === 'signup' ? 'signup-mode' : ''}`}>
        <section className="auth-panel auth-panel--form">
          <div className="auth-tabs">
            <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>Login</button>
            <button className={tab === 'signup' ? 'active' : ''} onClick={() => setTab('signup')}>Sign Up</button>
          </div>

          {tab === 'login' ? (
            <form className="stack-form auth-form-box">
              <h1>Welcome back</h1>
              <input placeholder="Email ID" />
              <input placeholder="Password" type="password" />
              <button className="btn btn--primary" type="button">Login</button>
            </form>
          ) : (
            <form className="stack-form auth-form-box">
              <h1>Create account</h1>
              <input placeholder="Full name" />
              <input placeholder="Phone number" />
              <input placeholder="Email ID" />
              <input placeholder="Password" type="password" />
              <select>
                <option>English</option>
                <option>Hindi</option>
              </select>
              <button className="btn btn--primary" type="button">Sign Up</button>
            </form>
          )}
        </section>

        <section className="auth-panel auth-panel--visual">
          <div>
            <span className="pill auth-pill">Urban Sense</span>
            <h2>Sliding auth style</h2>
            <p>
              This separate auth page replaces the single-file popup and is easier to connect with
              backend authentication later.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
