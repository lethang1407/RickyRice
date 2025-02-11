import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Bell } from "react-bootstrap-icons";

const CustomNavbar = () => {
  const avatarUrl =
    "https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg";

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9999/admin/notifications/1")
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setNotifications(data.data);
        }
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);

  const markAllAsRead = () => {
    const unreadIds = notifications
      .filter((notif) => !notif.isRead)
      .map((notif) => notif.notificationId);
    fetch("http://localhost:9999/admin/notifications/mark_as_read", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationIDs: unreadIds, isRead: true }),
    }).then(() => {
      setNotifications(
        notifications.map((notif) => ({ ...notif, isRead: true }))
      );
    });
  };

  const markAsRead = (notificationId) => {
    fetch("http://localhost:9999/admin/notifications/mark_as_read", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationIDs: [notificationId], isRead: true }),
    }).then(() => {
      setNotifications(
        notifications.map((notif) =>
          notif.notificationId === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );
    });
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-end">
      {/* Notifications Dropdown */}
      <div className="dropdown me-3">
        <button
          type="button"
          className="btn position-relative text-white"
          id="notificationDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <Bell size={24} />
          {notifications.some((notif) => !notif.isRead) && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {notifications.filter((notif) => !notif.isRead).length}
            </span>
          )}
        </button>
        <ul
          className="dropdown-menu dropdown-menu-end p-2"
          aria-labelledby="notificationDropdown"
          style={{ minWidth: "350px" }}
        >
          <li className="d-flex justify-content-between align-items-center px-2">
            <span className="fw-bold">Thông báo</span>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={markAllAsRead}
            >
              Đánh dấu tất cả là đã đọc
            </button>
          </li>
          <hr className="m-2" />
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <li
                key={notif.notificationId}
                className={`dropdown-item ${
                  notif.isRead ? "text-muted" : "fw-bold"
                }`}
              >
                <div>
                  <p className="mb-1">{notif.message}</p>
                  <small className="text-muted">
                    Tạo bởi: {notif.createdBy} -{" "}
                    {new Date(notif.createdAt).toLocaleString()}
                  </small>
                </div>
                {!notif.isRead && (
                  <input
                    type="checkbox"
                    onChange={() => markAsRead(notif.notificationId)}
                    className="ms-2"
                  />
                )}
              </li>
            ))
          ) : (
            <li className="dropdown-item text-muted">Không có thông báo</li>
          )}
        </ul>
      </div>

      {/* Profile Dropdown */}
      <div className="dropdown">
        <button
          type="button"
          className="btn p-0"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <img
            src={avatarUrl}
            alt="Admin Avatar"
            className="rounded-circle"
            style={{ width: "40px", height: "40px" }}
          />
        </button>

        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="dropdownMenuButton"
          style={{ zIndex: 1050 }}
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
