import React, { useState, useEffect } from "react";
import API from "../../Utils/API/API";
import { getToken, logout } from "../../Utils/UserInfoUtils";
import { message } from "antd";
import { successWSmile } from "../../Utils/AntdNotification";
import { useNavigate } from "react-router-dom";
import avt_default from "../../assets/img/avt_default.jpg";
import {
  Dropdown,
  Badge,
  Avatar,
  List,
  Button,
  Checkbox,
  Menu,
  Spin,
  Space,
} from "antd";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  CheckOutlined,
} from "@ant-design/icons";

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
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate("/account-info")}>
        <UserOutlined /> Hồ sơ tài khoản
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout} danger>
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <Dropdown
        overlay={
          <div
            style={{
              width: "550px",
              background: "white",
              borderRadius: "5px",
              padding: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Space
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <b>Thông báo</b>
              <Button
                type="link"
                onClick={markAllAsRead}
                disabled={notifications.every((notif) => notif.isRead)}
              >
                Đánh dấu tất cả đã xem
              </Button>
            </Space>

            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {notifications.length > 0 ? (
                <List
                  bordered
                  dataSource={notifications}
                  renderItem={(notif) => (
                    <List.Item
                      style={{
                        background: notif.isRead ? "#f5f5f5" : "#fff",
                        cursor: "pointer",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        alignItems: "flex-start",
                      }}
                    >
                      <b>{notif.message}</b>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "12px", color: "gray" }}>
                          Người gửi: {notif.createdBy} | Thời gian:{" "}
                          {new Date(notif.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>

                        {notif.isRead ? (
                          <span style={{ fontSize: "12px", color: "black" }}>
                            (Đã xem)
                          </span>
                        ) : (
                          <Checkbox
                            onChange={() => markAsRead(notif.notificationId)}
                          />
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ padding: "20px", textAlign: "center" }}>
                  Không có thông báo
                </div>
              )}
            </div>
          </div>
        }
        trigger={["click"]}
        placement="bottomRight"
      >
        <Badge count={notifications.filter((notif) => !notif.isRead).length}>
          <BellOutlined style={{ fontSize: "25px", cursor: "pointer", marginRight: "3px" }} />
        </Badge>
      </Dropdown>

      <Dropdown overlay={menu} placement="bottomRight">
        <Avatar src={avatarUrl} size={40} style={{ cursor: "pointer", marginRight: "10px" }} />
      </Dropdown>

      {/* {loading && <Spin />} */}
    </div>
  );
};

export default NavbarAccount;
