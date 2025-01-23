import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const CustomNavbar = () => {
  const avatarUrl = "https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg";

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <a className="navbar-brand" href="/admin">
        Admin Dashboard
      </a>
      <div className="dropdown">
        <button
          type="button"
          className="btn p-0"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          <img
            src={avatarUrl}
            alt="Admin Avatar"
            className="rounded-circle"
            style={{ width: "40px", height: "40px" }}
          />
        </button>

        {/* Dropdown menu */}
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="dropdownMenuButton"
        >
          <li>
            <a className="dropdown-item" href="/profile">
              Profile
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="/settings">
              Settings
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="/logout">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default CustomNavbar;
