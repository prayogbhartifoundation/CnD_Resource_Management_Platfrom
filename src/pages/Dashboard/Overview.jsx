import React from 'react'

const Overview = () => {
  return (
    <div>
        <div className="topBar">
          {/* Header */}
          <header className="header">
            <h2>Construction & Demolition Overview Delhi NCR</h2>
            <span className="date">🟢 As on 20-Mar-2025</span>
          </header>

          {/* Filters */}
          <div className="filters">
            
            <button className="active">Delhi NCR</button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left: Map */}
          <div className="map-placeholder">🗺️ Map Here</div>

          {/* Right: Statistics */}
          <div className="stats-panel">
            <div className="stat-card">
              <h3>Total Regions</h3>
              <p className="green">3</p>
            </div>
            <div className="stat-card">
              <h3>Total Departments</h3>
              <p className="green">17</p>
            </div>
            <div className="stat-card">
              <h3>Total Plants</h3>
              <p className="green">7</p>
            </div>
            <div className="stat-card">
              <h3>Total OffTake Target from all Departmens</h3>
              <p className="green">16,01,500</p>
            </div>
            <div className="stat-card">
              <h3>Total Offtake Achieved</h3>
              <p className="red">93,924 [5.86%]</p>
            </div>
            <div className="stat-card">
              <h3>Total Offtake Capacity</h3>
              <p className="green">5500 TPD</p>
            </div>
            <div className="stat-card">
              <h3>No. of Products</h3>
              <p className="green">18</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Overview