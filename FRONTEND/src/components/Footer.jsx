import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">🌿 Urban Sense</div>
      <p>AI-powered environmental and civic safety for smarter urban living.</p>
      <div className="footer__links">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </footer>
  );
}
