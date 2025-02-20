import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLinkClick = (path) => {
    navigate(path); 
  };

  const links = [
    { name: "Trang chủ", path: "/admin" },
    { name: "Quản lí tài khoản", path: "/admin/account_owner" },
    { name: "Quản lí cửa hàng", path: "/admin/view_stores" },
    { name: "Dịch vụ", path: "/admin/subscription_plans" },
  ];

  return (
    <div className="bg-dark text-white vh-100 p-3 sidebar">
      <h4 className="mb-4">Bảng điều khiển</h4>
      <Nav className="flex-column">
        {links.map((link) => (
          <Nav.Link
            key={link.name}
            className={`sidebar-link text-white ${
              location.pathname === link.path ? "active-link" : ""
            }`}
            onClick={() => handleLinkClick(link.path)}
          >
            {link.name}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
