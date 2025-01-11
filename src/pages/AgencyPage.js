import React from "react";
import "../styles/AgencyPage.css";

function AgencyPage() {
  return (
    <div className="agency-page">
      <header className="agency-header">
        <h2>Agency Name and Location</h2>
      </header>

      <section className="branding-section">
        <div className="branding-card">
          <p>Agency Branding (Logo)</p>
        </div>
        <div className="branding-details">
          <h3>Agency Branding Highlights, Messages</h3>
        </div>
        <div className="branding-card">
          <p>Agency Incharge</p>
        </div>
      </section>

      <section className="waste-processing-details">
        <h3>Waste Processing Details</h3>
        <div className="details-grid">
          <div className="detail-card">
            <p>Installed Waste Capacity</p>
          </div>
          <div className="detail-card">
            <p>Processed Material Types and Quantities</p>
          </div>
          <div className="detail-card">
            <p>Agency Contact Details</p>
          </div>
          <div className="detail-card">
            <p>Operation Details</p>
          </div>
        </div>
      </section>

      <section className="compliance-section">
        <h3>Compliance & Material Test Reports</h3>
        <div className="doc-buttons">
          <button className="doc-button">Doc Button Card</button>
          <button className="doc-button">Doc Button Card</button>
          <button className="doc-button">Doc Button Card</button>
        </div>
      </section>

      <footer className="agency-footer">Page Footer</footer>
    </div>
  );
}

export default AgencyPage;
