import React from "react";
import "../styles/AgencyPage.css";

function AgencyPage() {
  return (
    <div className="agency-page">
      {/* Header Section */}
  <div className="header-section">
    Agency Name and Location
  </div>
     
      {/* Branding Section */}
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

      {/* Waste Processing Section */}
      <section className="waste-processing-details">
  <h3 className="section-title">Waste Processing Details</h3>
  <div className="waste-details-layout">
    <div className="detail-card waste-capacity-card">
      <p>Installed Waste Capacity</p>
    </div>
    <div className="detail-card material-quantities-card">
      <p>Processed Material Types and Quantities</p>
    </div>
    <div className="detail-card contact-details-card">
      <p>Agency Contact Details</p>
    </div>
    <div className="detail-card operation-details-card">
      <p>Operation Details</p>
    </div>
  </div>
</section>


      {/* Compliance Section */}
      <section className="compliance-section">
        <h3>Compliance & Material Test Reports</h3>
        <div className="doc-buttons">
          <button className="doc-button">Doc Button Card</button>
          <button className="doc-button">Doc Button Card</button>
          <button className="doc-button">Doc Button Card</button>
        </div>
      </section>

      
    </div>
  );
}

export default AgencyPage;
