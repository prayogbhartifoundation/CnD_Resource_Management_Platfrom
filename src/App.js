import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InventoryStatusPage from "./pages/InventoryStatusPage";
import AgencyPage from "./pages/AgencyPage";
import ProductPage from "./pages/ProductPage";
import ContactUsPage from "./pages/ContactUsPage";

function App() {
  return (
    <Router>
      <header className="app-header">
        <div className="branding"></div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/inventory">Inventory Status</Link></li>
            <li><Link to="/product">Products</Link></li>
            <li><Link to="/agencies">Agencies</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryStatusPage />} />
          <Route path="/agencies" element={<AgencyPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
        </Routes>
      </main>

      <footer className="app-footer">Page Footer</footer>
    </Router>
  );
}

export default App;
