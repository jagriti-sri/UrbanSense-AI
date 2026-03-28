import { Link } from 'react-router-dom';
import './InfoCard.css';

export default function InfoCard({ icon, title, value, unit, status, tone = 'info', path = '/' }) {
  return (
    <Link to={path} className={`info-card info-card--${tone}`}>
      <div className="info-card__top">
        <span className="info-card__icon">{icon}</span>
        <span className={`badge badge--${tone}`}>{status}</span>
      </div>
      <div className="info-card__value">{value} <small>{unit}</small></div>
      <div className="info-card__title">{title}</div>
    </Link>
  );
}
