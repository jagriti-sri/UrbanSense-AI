import { useState } from 'react';
import './AuthPage.css';

export default function AuthPage() {
  const [tab, setTab] = useState('login');

  // 🔹 Login states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // 🔹 Signup states
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const BASE_URL = "http://127.0.0.1:5000";

  // 🔐 HANDLE LOGIN
  const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        alert("Login successful ✅");
      } else {
        alert("Login failed ❌");
      }

    } catch (err) {
      console.error(err);
    }
  };

  // 📝 HANDLE SIGNUP
  const handleSignup = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signupData)
      });

      const data = await res.json();

      if (data.msg) {
        alert("Signup successful ✅");
        setTab('login');
      } else {
        alert("Signup failed ❌");
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="container page-space auth-page">
      <div className={`auth-shell ${tab === 'signup' ? 'signup-mode' : ''}`}>
        <section className="auth-panel auth-panel--form">
          <div className="auth-tabs">
            <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>Login</button>
            <button className={tab === 'signup' ? 'active' : ''} onClick={() => setTab('signup')}>Sign Up</button>
          </div>

          {/* 🔐 LOGIN FORM */}
          {tab === 'login' ? (
            <form className="stack-form auth-form-box" onSubmit={(e) => e.preventDefault()}>
              <h1>Welcome back</h1>

              <input
                placeholder="Email ID"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />

              <input
                placeholder="Password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />

              <button className="btn btn--primary" onClick={handleLogin}>
                Login
              </button>
            </form>
          ) : (
            /* 📝 SIGNUP FORM */
            <form className="stack-form auth-form-box" onSubmit={(e) => e.preventDefault()}>
              <h1>Create account</h1>

              <input
                placeholder="Full name"
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              />

              <input
                placeholder="Email ID"
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              />

              <input
                placeholder="Password"
                type="password"
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              />

              <button className="btn btn--primary" onClick={handleSignup}>
                Sign Up
              </button>
            </form>
          )}
        </section>

        <section className="auth-panel auth-panel--visual">
          <div>
            <span className="pill auth-pill">Urban Sense</span>
            <h2>Smart Waste Management</h2>
            <p>
              Login or create an account to report waste issues and track complaints in real-time.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}