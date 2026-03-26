import { useState } from 'react';
import PageHero from '../components/PageHero';
import { submitContactForm } from '../services/api';
import './ContactPage.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', category: 'Support', message: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    await submitContactForm(form);
    alert('Support form submitted. Connect this with your backend later.');
    setForm({ name: '', category: 'Support', message: '' });
  }

  return (
    <main className="container page-space">
      <PageHero title="Contact & Query" subtitle="सहायता और प्रतिक्रिया" emoji="📩" tone="contact" />
      <section className="two-column-grid">
        <article className="panel-card">
          <h3>Support details</h3>
          <ul className="clean-list">
            <li>Email: support@urbansense.local</li>
            <li>Helpline: +91 90000 00000</li>
            <li>Location: Bhopal civic command center</li>
          </ul>
        </article>
        <article className="panel-card">
          <h3>Send a query</h3>
          <form className="stack-form" onSubmit={handleSubmit}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Support</option>
              <option>Feedback</option>
              <option>Bug Report</option>
            </select>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your message" rows="4" />
            <button className="btn btn--primary" type="submit">Send query</button>
          </form>
        </article>
      </section>
    </main>
  );
}
