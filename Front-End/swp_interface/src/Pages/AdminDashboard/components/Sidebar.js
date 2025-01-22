import React, { useState } from "react";
import { Nav } from "react-bootstrap";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("Dashboard");

  const handleLinkClick = (linkName) => {
    console.log("Link clicked:", linkName); // Xem giá trị được cập nhật
    setActiveLink(linkName);
  };

  return (
    <div className="bg-dark text-white vh-100 p-3">
      <h4 className="mb-4">Admin Dashboard</h4>
      <Nav className="flex-column">
        {["Dashboard", "Users", "Products", "Orders", "Settings"].map(
          (linkName) => (
            <Nav.Link
              key={linkName}
              href="#"
              className={`sidebar-link text-white ${
                activeLink === linkName ? "active-link" : ""
              }`}
              onClick={() => handleLinkClick(linkName)}
            >
              {linkName}
            </Nav.Link>
          )
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
