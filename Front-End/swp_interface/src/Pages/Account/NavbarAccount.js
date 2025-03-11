import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Bell } from "react-bootstrap-icons";
import API from "../../Utils/API/API";
import { getToken, logout } from "../../Utils/UserInfoUtils";
import { message } from "antd";
import { successWSmile } from "../../Utils/AntdNotification";
import { useNavigate } from "react-router-dom";
import avt_default from "../../assets/img/avt_default.jpg";
import "./style.css";

const NavbarAccount = () => {
  const [notifications, setNotifications] = useState([]);
  const token = getToken();
  const [messageApi] = message.useMessage();
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(avt_default);

  useEffect(() => {
    fetch(API.ACCOUNT.GET_INFOR_ACCOUNT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200 && data.data.avatar) {
          setAvatarUrl(data.data.avatar);
        }
      })
      .catch((error) => console.error("Error fetching avatar:", error));
  }, [token]);

  const handleLogout = () => {
    setLoading(true);
    successWSmile("See you later!", messageApi);
    logout();
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  useEffect(() => {
    fetch(API.ACCOUNT.GET_ALL_NOTIFICATIONS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setNotifications(data.data);
        }
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }, [token]);

  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter((notif) => !notif.isRead)
      .map((notif) => notif.notificationId);
    try {
      const response = await fetch(API.ACCOUNT.MARK_NOTI_AS_READ, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationIDs: unreadIds, isRead: true }),
      });

      if (!response.ok) throw new Error("Failed to mark notifications as read");

      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(API.ACCOUNT.MARK_NOTI_AS_READ, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notificationIDs: [notificationId],
          isRead: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to mark notification as read");

      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.notificationId === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-end">
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
            <button className="dropdown-item" href="#">
              Hồ sơ tài khoản
            </button>
          </li>
          <li>
            <button className="dropdown-item" href="#">
              Cài đặt
            </button>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <button className="dropdown-item" onClick={handleLogout}>
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarAccount;
