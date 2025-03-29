import React, { useState } from "react";
import CustomerList from "./components/customerList";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  ShopOutlined,
  VideoCameraOutlined,
  InsertRowBelowOutlined,
  TeamOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { Button, Layout, Menu, theme, Dropdown } from "antd";
import "./style.css";
import CustomFooter from "../../Components/Footer";
import NavbarAccount from "../Account/NavbarAccount";
import logo from "../../assets/img/logo-no-background.png";
import { WebSocketProvider } from "../../Utils/Websocket/WebsocketContextProvider";

const { Header, Sider, Content } = Layout;

const Employee_Customer = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleNavigation = (path) => {
    navigate(path);
  };
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
          <Menu theme="light" mode="inline" defaultSelectedKeys={["3"]}>
            <Menu.Item
              key="1"
              icon={<InsertRowBelowOutlined />}
              onClick={() => handleNavigation("/employee/products")}
            >
              Sản Phẩm Gạo
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<ShopOutlined />}
              onClick={() => handleNavigation("/employee/ricezone")}
            >
              Khu Vực Gạo
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<TeamOutlined />}
              onClick={() => handleNavigation("/employee/customers")}
            >
              Khách Hàng
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<SolutionOutlined />}
              onClick={() => handleNavigation("/employee/invoices")}
            >
              Hóa Đơn
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<SolutionOutlined />}
              onClick={() => handleNavigation('/employee/customer-debt')}
            >
              Quản Lí Nợ
            </Menu.Item>
          </Menu>
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
            <CustomerList />
          </Content>
        </Layout>
      </Layout>
      <CustomFooter />
    </div>
  );
};
export default Employee_Customer;
