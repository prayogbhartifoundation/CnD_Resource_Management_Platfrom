import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <button className="sidebar-btn">Hindi</button>
        <nav>
          <button className="nav-item">🏠 Home</button>
          <button className="nav-item">📜 GOBARdhan Portal</button>
          <button className="nav-item">📖 Village Progress Report</button>
          <button className="nav-item">📊 Capacity Building Dashboard</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <h2>ODF Plus Model 1st Verification Villages</h2>
          <span className="date">🟢 As on 19-Mar-2025</span>
        </header>

        {/* Filters */}
        <div className="filters">
          <button>ODF-Plus Model District</button>
          <button>ODF Plus State</button>
          <button>ODF Plus Model State</button>
          <button className="active">ODF Plus Model 1st Verification</button>
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left: Map */}
          <div className="map-placeholder">🗺️ Map Here</div>

          {/* Right: Statistics */}
          <div className="stats-panel">
            <div className="stat-card">
              <h3>Total Districts</h3>
              <p className="green">761</p>
            </div>
            <div className="stat-card">
              <h3>Total Blocks</h3>
              <p className="red">7,154</p>
            </div>
            <div className="stat-card">
              <h3>Total Gram Panchayats</h3>
              <p className="green">2,58,192</p>
            </div>
            <div className="stat-card">
              <h3>SBM Villages</h3>
              <p className="red">5,86,788</p>
            </div>
            <div className="stat-card">
              <h3>ODF Plus Villages</h3>
              <p className="red">+318 * 5,64,154</p>
            </div>
            <div className="stat-card">
              <h3>ODF Plus Model</h3>
              <p className="green">+274 4,45,159</p>
            </div>
            <div className="stat-card">
              <h3>ODF Plus Model (1st Verification)</h3>
              <p className="red">2,63,988</p>
            </div>
            <div className="stat-card">
              <h3>ODF Plus Model (2nd Verification)</h3>
              <p className="green">2,380</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
