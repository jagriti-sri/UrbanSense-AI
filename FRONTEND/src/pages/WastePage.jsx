import { useState, useEffect } from 'react';
import PageHero from '../components/PageHero';
import './WastePage.css';

export default function WastePage() {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [image, setImage] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [tracking, setTracking] = useState([]); // ✅ NEW

  const BASE_URL = "http://127.0.0.1:5000";

  // 📊 FETCH COMPLAINTS
  useEffect(() => {
    fetch(`${BASE_URL}/complaint/all`)
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(err => console.error(err));
  }, []);

  // 📊 FETCH TRACKING (NEW)
  useEffect(() => {
    fetch(`${BASE_URL}/tracking/my`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => setTracking(data))
      .catch(err => console.error(err));
  }, []);

  // 🚀 SUBMIT COMPLAINT
  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("waste_type", wasteType);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("image", image);

    try {
      const res = await fetch(`${BASE_URL}/complaint/add`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        alert("Complaint submitted ✅");

        const updated = await fetch(`${BASE_URL}/complaint/all`);
        const updatedData = await updated.json();
        setComplaints(updatedData);

        setLocation('');
        setDescription('');
        setWasteType('');
        setImage(null);
      } else {
        alert(data.error || "Error ❌");
      }

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="container page-space">
      <PageHero title="Waste Management" subtitle="कचरा शिकायत दर्ज करें" emoji="♻️" tone="waste" />

      <section className="two-column-grid">

        {/* LEFT SIDE */}
        <article className="panel-card">
          <h3>Upload evidence</h3>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <form className="stack-form" onSubmit={handleSubmit}>

            <select value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
              <option value="">Select Waste Type</option>
              <option value="plastic">Plastic</option>
              <option value="organic">Organic</option>
              <option value="metal">Metal</option>
            </select>

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the waste issue"
              rows="4"
            />

            <button className="btn btn--primary" type="submit">
              Submit complaint
            </button>
          </form>
        </article>

        {/* RIGHT SIDE */}
        <article className="panel-card">
          <h3>Recent complaint status</h3>

          <div className="status-list">
            {complaints.map((item) => (
              <div className="status-item" key={item._id}>
                
                <div>
                  <strong>{item.waste_type}</strong>
                  <p>{item.location}</p>

                  {/* 📸 IMAGE */}
                  {item.image && (
                    <img
                      src={`${BASE_URL}/complaint/uploads/${item.image.split('/').pop()}`}
                      width="100"
                    />
                  )}

                  {/* 🔳 QR */}
                  <img
                    src={`${BASE_URL}/qr/generate/${item._id}`}
                    width="120"
                  />
                </div>

                <span className="badge badge--info">
                  {item.status}
                </span>

              </div>
            ))}
          </div>
        </article>

      </section>

      {/* ✅ NEW SECTION: TRACKING */}
      <section className="panel-card" style={{ marginTop: "20px" }}>
        <h3>Monthly Waste Collection Status</h3>

        {tracking.length === 0 ? (
          <p>No tracking data available</p>
        ) : (
          tracking.map((item) => (
            <div key={item._id} className="status-item">
              <strong>{item.month} {item.year}</strong>

              <p style={{ color: item.status === "pending" ? "red" : "green" }}>
                Status: {item.status}
              </p>

              <p>Collection Date: {item.collection_date}</p>
            </div>
          ))
        )}
      </section>

    </main>
  );
}