import PageHero from '../components/PageHero';
import { airTrend, trendDays, healthAdvice } from '../data/mockData';
import './AirPage.css';

export default function AirPage() {
  const todayAQI = 87;
  const tomorrowAQI = 62;

  return (
    <main className="container page-space">
      <PageHero title="Air Quality" subtitle="वायु गुणवत्ता — Bhopal" emoji="🌬️" tone="air" />

      <section className="big-metric-card">
        <p className="metric-kicker">TODAY'S AQI</p>
        <h2>{todayAQI}</h2>
        <span className="badge badge--caution">Moderate / मध्यम</span>
        <p className="metric-meta">Station: Shyamla Hills • Last updated: 10:30 AM</p>
      </section>

      <section className="two-column-grid">
        <article className="panel-card">
          <h3>Tomorrow prediction</h3>
          <div className="air-next">{tomorrowAQI} AQI</div>
          <p>Good air expected tomorrow morning.</p>
        </article>
        <article className="panel-card">
          <h3>SMS alerts</h3>
          <ul className="clean-list">
            <li>AQI Daily Alert — Enabled</li>
            <li>Poor AQI Warning — Enabled</li>
            <li>Weekly Summary — Disabled</li>
          </ul>
        </article>
      </section>

      <section className="two-column-grid">
        <article className="panel-card">
          <h3>Health advice</h3>
          <div className="advice-list">
            {healthAdvice.map((item) => <p key={item}>{item}</p>)}
          </div>
        </article>
        <article className="panel-card">
          <h3>Weekly trend</h3>
          <div className="trend-list">
            {airTrend.map((value, index) => (
              <div className="trend-row" key={`${trendDays[index]}-${value}`}>
                <span>{trendDays[index]}</span>
                <div className="trend-track"><div style={{ width: `${Math.min(value, 150) / 1.5}%` }} /></div>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
