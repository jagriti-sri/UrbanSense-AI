import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.css";

const features = [
  ["🌬️", "AQI Alerts", "/air"],
  ["🌧️", "Rainfall Prediction", "/rainfall"],
  ["🌊", "Flood Risk", "/flood"],
  ["♻️", "Waste Reporting", "/waste"],
  ["🗺️", "Land Misuse Reporting", "/land"],
  ["🎙️", "Voice Support", "/voice"],
];

export default function LandingPage() {

  const navigate = useNavigate();

  return (
    <main>

      {/* HERO SECTION */}

      <section className="landing-hero">
        <div className="container landing-hero__grid">

          <div>
            <span className="pill">
              Smart civic AI for Bhopal
            </span>

            <h1>
              Urban Sense
            </h1>

            <p className="landing-hero__hindi">
              भोपाल के लिए सरल, सुरक्षित और स्मार्ट वेब ऐप
            </p>

            <p className="landing-hero__text">
              A user-friendly environmental and civic dashboard with separate modules for air,
              rainfall, waste reporting, land reporting, support, and profile settings.
            </p>

            <div className="landing-hero__actions">

              <Link
                className="btn btn--primary"
                to="/dashboard"
              >
                Open Dashboard
              </Link>

              <Link
                className="btn btn--outline"
                to="/about"
              >
                Learn More
              </Link>

            </div>
          </div>


          {/* RIGHT CARD */}

          <div className="landing-hero__card">

            <div className="city-illustration">
              🏙️
            </div>

            <h3>
              AI-powered environmental and civic safety
            </h3>

            <p>
              Built to be simple, clear, bilingual, and easy to connect with your backend APIs.
            </p>

          </div>

        </div>
      </section>



      {/* MODULE SECTION */}

      <section className="container landing-features">

        <div className="section-heading">

          <h2>
            Modules included
          </h2>

          <p>
            Each page is separated so you can connect backend routes and ML models easily.
          </p>

        </div>


        {/* FEATURE GRID */}

        <div className="landing-features__grid">

          {features.map(([icon, label, route]) => (

            <article
              className="landing-feature"
              key={label}
              onClick={() => navigate(route)}
              style={{ cursor: "pointer" }}
            >

              <span>
                {icon}
              </span>

              <h3>
                {label}
              </h3>

            </article>

          ))}

        </div>

      </section>

    </main>
  );
}