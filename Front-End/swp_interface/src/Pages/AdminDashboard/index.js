import React from "react";
import './style.css'
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardContent from "./DashboardContent";

function AdminDashboard() {
  return (
    <div>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <DashboardContent />
      </div>
    </div>
  );
}


export default AdminDashboard;
