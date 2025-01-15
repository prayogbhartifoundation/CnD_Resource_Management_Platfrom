import React from "react";
import "../styles/HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      <section className="overview-details">
        <div className="agency-branding">
          <h2>agency Branding</h2>
        </div>
        <div className="plant-agency">
          <h2>Plant Agency Overview Details</h2>
          <ul>
            <li>Location</li>
            <li>Waste Received</li>
            <li>Type of Processed Material</li>
            <li>Plant Capacity</li>
          </ul>
        </div>
      </section>

      <section className="statuses">
        <button className="status-button">Offtake Status</button>
        <button className="status-button">Inventory Status</button>
      </section>

      <section className="agency-cards">
        <div className="card">
          <h3>Agency Page 1</h3>
          <p>Details of Agency 1</p>
        </div>
        <div className="card">
          <h3>Agency Page 2</h3>
          <p>Details of Agency 2</p>
        </div>
        <div className="card">
          <h3>Agency Page 3</h3>
          <p>Details of Agency 3</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
