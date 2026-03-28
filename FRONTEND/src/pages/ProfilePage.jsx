import PageHero from '../components/PageHero';
import { profileStats } from '../data/mockData';
import './ProfilePage.css';

export default function ProfilePage() {
  return (
    <main className="container page-space">
      <PageHero title="Profile & Settings" subtitle="प्रोफाइल और सेटिंग्स" emoji="👤" tone="profile" />
      <section className="two-column-grid">
        <article className="panel-card">
          <h3>User details</h3>
          <div className="details-list">
            <p><strong>Name:</strong> Megha Rajeev</p>
            <p><strong>Email:</strong> megharajeev.reshmi@gmail.com</p>
            <p><strong>Language:</strong> English + Hindi</p>
            <p><strong>SMS Alerts:</strong> Enabled</p>
          </div>
        </article>
        <article className="panel-card">
          <h3>My activity</h3>
          <div className="profile-stats-grid">
            {profileStats.map((item) => (
              <div className="profile-stat-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
