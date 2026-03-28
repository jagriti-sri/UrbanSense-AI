import { useState } from 'react';
import PageHero from '../components/PageHero';
import { wasteComplaints } from '../data/mockData';
import { submitWasteReport } from '../services/api';
import './WastePage.css';

export default function WastePage() {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    await submitWasteReport({ location, description });
    alert('Waste complaint submitted. Connect this form to your backend endpoint.');
    setLocation('');
    setDescription('');
  }

  return (
    <main className="container page-space">
      <PageHero title="Waste Management" subtitle="कचरा शिकायत दर्ज करें" emoji="♻️" tone="waste" />
      <section className="two-column-grid">
        <article className="panel-card">
          <h3>Upload evidence</h3>
          <div className="upload-box">📷 Tap here to connect image upload</div>
          <form className="stack-form" onSubmit={handleSubmit}>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the waste issue" rows="4" />
            <button className="btn btn--primary" type="submit">Submit complaint</button>
          </form>
        </article>
        <article className="panel-card">
          <h3>Recent complaint status</h3>
          <div className="status-list">
            {wasteComplaints.map((item) => (
              <div className="status-item" key={item.title}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.location}</p>
                </div>
                <span className="badge badge--info">{item.status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
