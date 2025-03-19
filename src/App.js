import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InventoryStatusPage from "./pages/InventoryStatusPage";
import AgencyPage from "./pages/AgencyPage";
import ProductPage from "./pages/ProductPage";
import ContactUsPage from "./pages/ContactUsPage";
import Dashboard from "./pages/Dashboard";
import LoginNewPage from "./pages/LoginNewPage";
import './App.css';
import Sidebar from "./components/Sidebar";
import OfftakeStatusPage from "./pages/OfftakeStatusPage";
import SuperAdminLogin from "./pages/superAdminPages/SuperAdminLogin";
import SuperAdminHome from "./pages/superAdminPages/SuperAdminHome";
import SuperAdminReg from "./pages/superAdminPages/SuperAdminReg";
import AgencyLogin from "./pages/AgencyPages/AgencyLogin";
import AgencyHome from "./pages/AgencyPages/AgencyHome";
import AgencyResetPassword from "./pages/AgencyPages/AgencyResetPassword";
import PlantHome from "./pages/PlantPages/PlantHome";
import PlantLogin from "./pages/PlantPages/PlantLogin";
import PlantResetPassword from "./pages/PlantPages/PlantResetPassword";
import InventoryStatusPageBeta from "./pages/InventoryStatusPageBeta";
import VisitorInfoForm from "./utils/VisitorInfoForm";
import DepartmentPage from "./pages/DepartmentPage";
import logo from "./assets/logo/LogoNew.jpg";
import SwachhLogo from "./assets/logo/Swachh-Bharat-Abhiyan.jpg";
import PlantPage from "./pages/plantPage";
import CityWiseOfftakeAnalytics from "./pages/CityWiseOfftakeAnalytics";

function App() {

  const [sideBarOpen, setSideBarOpen] = useState(false)
  const [propData,setPropData] = useState(0)

  return (
    <Router>

      {/* Add this logo container */}
  <div className="body-logo">
    <img src={logo} alt="Watermark Logo" />
    <img src={SwachhLogo} alt="Swachh Logo" />

  </div>

      <header className="app-header">
        <nav>
          <ul>
            <li><Link to="/">Home<b></b></Link></li>
            {/* <li><Link to="/inventory">Inventory Status</Link></li> */}
            <li><Link to="/inventoryBeta">Inventory Status</Link></li>
            <li><Link to="/product">Products</Link></li>
            <li><Link to="/agencies">Agencies</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/Dashboard">Dashboard</Link></li>
            {/* <li><Link to="/agency-home">Agency Page</Link></li>
            <li><Link to="/plant-home">Plant Page</Link></li> */}
            {/* <li><Link to="/Login">Login</Link></li> */}
          </ul>
        </nav>

        <div className="hamburger" onClick={() => setSideBarOpen(!sideBarOpen)}>📄</div>
      </header>

      {sideBarOpen && <Sidebar setSideBarOpen={setSideBarOpen}/>}

      <main>
        <Routes>
          <Route path="/" element={<HomePage setPropData= {setPropData}/>} />
          <Route path="/inventory" element={<InventoryStatusPage />} />
          <Route path="/inventoryBeta" element={<InventoryStatusPageBeta />} />
          <Route path="/offtake" element={<OfftakeStatusPage />} />
          <Route path="/agencies" element={<AgencyPage />} />
          <Route path="/plant" element={<PlantPage plantInfo= {propData}/>} />
          <Route path="/department" element={<DepartmentPage />} />
          <Route path="/cityWiseOfftake" element={<CityWiseOfftakeAnalytics />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/s_admin-reg" element={<SuperAdminReg />} />
          <Route path="/s_admin-login" element={<SuperAdminLogin />} />
          <Route path="/s_admin" element={<SuperAdminHome />} />
          <Route path="/agency-login" element={<AgencyLogin />} />
          <Route path="/agency-home" element={<AgencyHome />} />
          <Route path="/reset-password" element={<AgencyResetPassword />} />
          <Route path="/plant-login" element={<PlantLogin />} />
          <Route path="/reset-password-plant" element={<PlantResetPassword />} />
          <Route path="/plant-home" element={<PlantHome />} />
          <Route path="/Login" element={<LoginNewPage />} />
        </Routes>
        {/* <VisitorInfoForm/> */}
      </main>

      <footer className="app-footer">
      © 2025 Indo Enviro Integrated Solutions (P) Limited. All rights reserved.
      </footer>
    </Router>
  );
}
export default App;