import React, { useState } from "react";
import "./Dashboard.css";
import Overview from "./Overview";
import OfftakeMis from "./OfftakeMis";
import ProductMis from "./ProductMis";

const navItems = [
  { name: "Overview", icon: "📜", element: <Overview /> },
  { name: "Offtake", icon: "📖", element: <OfftakeMis /> },
  { name: "Products", icon: "🧱", element: <ProductMis /> },
];

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState(0);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <button className="sidebar-btn">Dashboard</button>
        <nav>

          {navItems.map((item, index) => (
            <button key={index} className={`nav-item ${activeNav === index ? "active" : ""}`}
            onClick={() => setActiveNav(index)}
            >
              {item.icon} {item.name}
            </button>
          ))}
          
          {/* <button className="nav-item">📊 Capacity Building Dashboard</button> */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {navItems[activeNav].element}
      </main>
    </div>
  );
};

export default Dashboard;
