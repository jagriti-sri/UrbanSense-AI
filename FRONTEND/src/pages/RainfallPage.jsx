import PageHero from '../components/PageHero';
import { rainfallForecast } from '../data/mockData';
import './RainfallPage.css';

export default function RainfallPage() {
  return (
    <main className="container page-space">
      <PageHero title="Rainfall & Flood Watch" subtitle="बारिश और बाढ़ अलर्ट" emoji="🌧️" tone="rain" />
      <div className="alert alert--danger">Heavy rain alert may affect low-lying roads tonight.</div>

      <section className="two-column-grid">
        <article className="panel-card">
          <h3>Today's weather</h3>
          <div className="weather-highlight">⛅ 29°C</div>
          <p>Humidity: 62% • Condition: Partly Cloudy • Location: Bhopal</p>
        </article>
        <article className="panel-card">
          <h3>Flood risk</h3>
          <div className="risk-box risk-box--safe">LOW</div>
          <p>Road safety advisory: Drive slowly near lake and drain areas.</p>
        </article>
      </section>

      <section className="forecast-grid">
        {rainfallForecast.map((item) => (
          <article className="forecast-card" key={item.day}>
            <div className="forecast-card__icon">{item.icon}</div>
            <h4>{item.day}</h4>
            <p>{item.temp}</p>
            <small>{item.rain} chance</small>
          </article>
        ))}
      </section>
    </main>
  );
}
