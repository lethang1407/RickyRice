import React from "react";
import './style.css'
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardContent from "./DashboardContent";
import Footer from "./components/Footer";

function AdminDashboard() {
  return (
    <div className="d-flex">
      <div style={{ width: "250px" }}>
        <Sidebar />
      </div>
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <DashboardContent />
        <Footer />
      </div>
    </div>
  );
}

export default AdminDashboard;
