import PageHero from '../components/PageHero';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <main className="container page-space">
      <PageHero title="About Urban Sense" subtitle="Mission, impact, and accessibility" emoji="ℹ️" tone="about" />
      <section className="about-grid">
        <article className="panel-card">
          <h3>Mission</h3>
          <p>Urban Sense helps citizens understand air, rain, flood, waste, and land issues using clear and simple interfaces.</p>
        </article>
        <article className="panel-card">
          <h3>Why this frontend is separated</h3>
          <p>Each module has its own page and CSS file, so backend endpoints and ML model outputs can be connected page by page.</p>
        </article>
        <article className="panel-card">
          <h3>Accessibility focus</h3>
          <p>Large cards, bilingual text, friendly colors, and visible voice support make the UI easier for first-time users.</p>
        </article>
      </section>
    </main>
  );
}
