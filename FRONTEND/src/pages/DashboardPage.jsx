import InfoCard from '../components/InfoCard';
import { summaryCards } from '../data/mockData';
import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <main className="container page-space">
      <section className="dashboard-banner">
        <div>
          <h1>🙏 Namaste, Citizen Ji!</h1>
          <p>Today in Bhopal — quick environmental and civic summary.</p>
        </div>
        <div className="dashboard-banner__icon">📍</div>
      </section>

      <div className="alert alert--warning">
        Moderate AQI today. Avoid heavy outdoor activity in the morning.
      </div>

      <section>
        <div className="section-heading left">
          <h2>Today's summary</h2>
        </div>
        <div className="dashboard-grid">
          {summaryCards.map((card) => <InfoCard key={card.title} {...card} />)}
        </div>
      </section>
    </main>
  );
}
