import React from "react";
import "../styles/Components.css";
import { Link } from "react-router-dom";

const Sidebar = ({setSideBarOpen}) => {
  return (
    <div className="sidebarNav">
      <ul>
        <li onClick={() => setSideBarOpen(false)}>
          <Link className="sidebarLink" to="/">Home</Link>
        </li>
        <li onClick={() => setSideBarOpen(false)}>
          <Link className="sidebarLink"  to="/inventory">Inventory Status</Link>
        </li>
        <li onClick={() => setSideBarOpen(false)}>
          <Link className="sidebarLink" to="/product">Products</Link>
        </li>
        <li onClick={() => setSideBarOpen(false)}>
          <Link className="sidebarLink" to="/agencies">Agencies</Link>
        </li>
        <li onClick={() => setSideBarOpen(false)}>
          <Link className="sidebarLink" to="/contact">Contact Us</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
