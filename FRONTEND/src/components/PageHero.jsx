import './PageHero.css';

export default function PageHero({ title, subtitle, emoji, tone = 'default' }) {
  return (
    <section className={`page-hero page-hero--${tone}`}>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="page-hero__emoji">{emoji}</div>
    </section>
  );
}
