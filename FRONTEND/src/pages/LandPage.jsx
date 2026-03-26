import { useState } from 'react';
import PageHero from '../components/PageHero';
import { landIssues } from '../data/mockData';
import { submitLandReport } from '../services/api';
import './LandPage.css';

export default function LandPage() {
  const [issueType, setIssueType] = useState(landIssues[0]);
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    await submitLandReport({ issueType, location, details });
    alert('Land issue submitted. Replace this with backend integration later.');
    setLocation('');
    setDetails('');
  }

  return (
    <main className="container page-space">
      <PageHero title="Land Usage" subtitle="भूमि अतिक्रमण रिपोर्ट करें" emoji="🗺️" tone="land" />
      <div className="alert alert--warning">Disaster-prone area detected near water bodies and blocked drains.</div>
      <section className="two-column-grid">
        <article className="panel-card">
          <h3>Select issue type</h3>
          <div className="issue-grid">
            {landIssues.map((item) => (
              <button
                key={item}
                type="button"
                className={issueType === item ? 'issue-chip active' : 'issue-chip'}
                onClick={() => setIssueType(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </article>
        <article className="panel-card">
          <h3>Submit report</h3>
          <form className="stack-form" onSubmit={handleSubmit}>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter issue location" />
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Explain the problem" rows="4" />
            <button className="btn btn--primary" type="submit">Submit land report</button>
          </form>
        </article>
      </section>
    </main>
  );
}
