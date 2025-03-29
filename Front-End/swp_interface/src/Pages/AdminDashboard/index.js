import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  AreaChartOutlined,
  UserOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import "./style.css";
import CustomFooter from "../../Components/Footer";
import { Link, useLocation, Outlet } from "react-router-dom";
import logo from "../../assets/img/logo-no-background.png";
import NavbarAccount from "../Account/NavbarAccount";
import { WebSocketProvider } from "../../Utils/Websocket/WebsocketContextProvider";

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();

  const selectedKey = location.pathname.startsWith(`/admin/statistic`)
    ? "1"
    : location.pathname.startsWith(`/admin/account_owner`)
    ? "2"
    : location.pathname.startsWith(`/admin/view_stores`)
    ? "3"
    : location.pathname.startsWith(`/admin/subscription_plans`)
    ? "4"
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          style={{
            backgroundColor: "white",
            color: "#fff",
          }}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="demo-logo-vertical" />
          <div
            style={{
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: "60px",
                  width: "auto",
                  maxWidth: collapsed ? "40px" : "120px",
                  transition: "max-width 0.3s ease",
                  cursor: "pointer",
                  visibility: collapsed ? "hidden" : "visible",
                }}
              />
            </Link>
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={[
              {
                key: "1",
                icon: <AreaChartOutlined />,
                label: <Link style={{textDecoration:'none'}} to={`/admin/statistic`}>Thống kê</Link>,
              },
              {
                key: "2",
                icon: <UserOutlined />,
                label: (
                  <Link style={{textDecoration:'none'}} to={`/admin/account_owner`}>Danh sách tài khoản</Link>
                ),
              },
              {
                key: "3",
                icon: <ShopOutlined />,
                label: (
                  <Link style={{textDecoration:'none'}} to={`/admin/view_stores`}>Danh sách cửa hàng</Link>
                ),
              },
              {
                key: "4",
                icon: <ApartmentOutlined />,
                label: <Link style={{textDecoration:'none'}} to={`/admin/subscription_plans`}>Dịch vụ</Link>,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: "0 16px",
              background: colorBgContainer,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <WebSocketProvider><NavbarAccount /></WebSocketProvider>
          </Header>

          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <CustomFooter />
    </div>
  );
};
export default AdminDashboard;
