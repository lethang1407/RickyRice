import React, { useState } from "react";
import {
  AppstoreOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProductOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import "./style.scss";
import CustomFooter from "../../Footer";
import { Link, Outlet, useLocation } from "react-router-dom";
import NavbarAccount from "../../../Pages/Account/NavbarAccount";

const { Header, Sider, Content } = Layout;

const StoreOwnerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const selectedKey = location.pathname.startsWith("/store-owner/store")
    ? "1"
    : location.pathname.startsWith("/store-owner/invoice")
    ? "2"
    : location.pathname.startsWith("/store-owner/product")
    ? "3"
    : location.pathname.startsWith("/store-owner/employee")
    ? "4"
    : location.pathname.startsWith("/store-owner/statistic")
    ? "5"
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
          <div style={{ height: "80px" }}>Logo</div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            selectedKeys={[selectedKey]}
            items={[
              {
                key: "1",
                icon: <ShopOutlined />,
                label: (
                  <Link
                    to="/store-owner/store"
                    style={{ textDecoration: "none" }}
                  >
                    Store
                  </Link>
                ),
              },
              {
                key: "2",
                icon: <FileTextOutlined />,
                label: (
                  <Link
                    to="/store-owner/invoice"
                    style={{ textDecoration: "none" }}
                  >
                    Invoice
                  </Link>
                ),
              },
              {
                key: "3",
                icon: <AppstoreOutlined />,
                label: (
                  <Link
                    to="/store-owner/product"
                    style={{ textDecoration: "none" }}
                  >
                    Product
                  </Link>
                ),
              },
              {
                key: "4",
                icon: <TeamOutlined />,
                label: (
                  <Link
                    to="/store-owner/employee"
                    style={{ textDecoration: "none" }}
                  >
                    Employee
                  </Link>
                ),
              },
              {
                key: "5",
                icon: <TeamOutlined />,
                label: (
                  <Link
                    to="/store-owner/statistic"
                    style={{ textDecoration: "none" }}
                  >
                    Statistic
                  </Link>
                ),
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
            <NavbarAccount />
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
export default StoreOwnerLayout;
