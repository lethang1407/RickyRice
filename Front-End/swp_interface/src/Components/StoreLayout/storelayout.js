import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  TeamOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
// import './style.css';
import {
  Link,
  Outlet,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import CustomFooter from "../../Components/Footer";

const { Header, Sider, Content } = Layout;

const StoreLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const storeID = useParams();
  const selectedKey = location.pathname.startsWith(`/store/${storeID.id}/zone`)
    ? "1"
    : location.pathname.startsWith(`/store/${storeID.id}/productattribute`)
      ? '4'
      : location.pathname.startsWith(`/store/${storeID.id}/product`)
        ? "2"
        : location.pathname.startsWith(`/store/${storeID.id}/update-info`)
          ? "3"
          : location.pathname.startsWith(`/store/${storeID.id}/category`)
            ? '5'
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
            selectedKeys={[selectedKey]}
            items={[
              {
                key: "1",
                icon: <ShopOutlined />,
                label: <Link to={`/store/${storeID.id}/zone`}  style={{ textDecoration: 'none' }}>Khu vực</Link>,
              },
              {
                key: "2",
                icon: <AppstoreOutlined />,
                label: <Link to={`/store/${storeID.id}/product`}  style={{ textDecoration: 'none' }}>Sản phẩm</Link>,
              },
              {
                key: "3",
                icon: <IdcardOutlined />,
                label: (
                  <Link to={`/store/${storeID.id}/update-info`}  style={{ textDecoration: 'none' }}>
                    Cập nhật cửa hàng
                  </Link>
                ),
              },
              {
                key: '4',
                icon: <FileTextOutlined />,
                label: <Link to={`/store/${storeID.id}/productattribute`} style={{ textDecoration: 'none' }}>Thuộc tính sản phẩm</Link>,
              },
              {
                key: '5',
                icon: <FileTextOutlined />,
                label: <Link to={`/store/${storeID.id}/category`} style={{ textDecoration: 'none' }}>Loại</Link>,
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
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <CustomFooter />
    </div>
  );
};
export default StoreLayout;