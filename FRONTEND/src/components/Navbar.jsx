import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const navItems = [
  ['/', 'Home'],
  ['/auth', 'Login'],
  ['/dashboard', 'Dashboard'],
  ['/air', 'Air'],
  ['/flood', 'Flood Risk'],
  ['/rainfall', 'Rainfall'],
  ['/waste', 'Waste'],
  ['/land', 'Land'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
  ['/profile', 'Profile'],
  ['/admin', 'Admin'], // ✅ ADDED
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar__inner">

        <NavLink to="/" className="navbar__brand">
          <div className="navbar__logo">🌿</div>
          <div>
            <span className="navbar__name">Urban Sense</span>
            <span className="navbar__tag">Bhopal MVP</span>
          </div>
        </NavLink>

        <nav className="navbar__links">
          {navItems.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive || (path === '/' && location.pathname === '/')
                  ? 'active'
                  : ''
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

      </div>
    </header>
  );
}