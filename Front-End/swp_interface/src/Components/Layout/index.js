import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import "./style.css";
import CustomFooter from "../Footer";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo-no-background.png";
const { Header, Sider, Content } = Layout;

const OwnerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "nav 1",
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: "nav 2",
              },
              {
                key: "3",
                icon: <UploadOutlined />,
                label: "nav 3",
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
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
            Content
          </Content>
        </Layout>
      </Layout>
      <CustomFooter />
    </div>
  );
};
export default OwnerLayout;
