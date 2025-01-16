import React from "react";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="home-page">
      <section className="overview-details">

        <div className="leftPanel">
          <div className="agency-branding">
            <div className="logo"></div>
            <h2>agency Branding</h2>
          </div>
          <div >
            <h2>Plant Location</h2>
          </div>
        </div>

        <div className="plant-agency">
          <h2>Plant Overview</h2>
          <ul>
            <li>Waste Received</li>
            <li>Type of Processed Material</li>
            <li>Plant Capacity</li>
          </ul>
        </div>
      </section>

      <section className="action-btns">
        <button type="button" onClick={() => navigate('/offtake')} className="status-button">Offtake Status</button>
        <button type="button" onClick={() => navigate('/inventory')} className="status-button">Inventory Status</button>
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
