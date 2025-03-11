import React, { useState, useEffect } from 'react';
import {
  AppstoreOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
// import './style.css';
import { Link, Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import CustomFooter from '../../Components/Footer'; 

const { Header, Sider, Content } = Layout;

const StoreLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const storeID  = useParams();  // Lấy storeID từ URL

  const selectedKey = location.pathname.startsWith(`/store/${storeID.id}/zone`)
    ? '1'
    : location.pathname.startsWith(`/store/${storeID.id}/product`)
      ? '2'
      : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          style={{
            backgroundColor: 'white',
            color: '#fff',
          }}
          trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <div style={{ height: '80px' }}>
            Logo
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={[
              {
                key: '1',
                icon: <ShopOutlined />,
                label: <Link to={`/store/${storeID.id}/zone`}>Zone</Link>,
              },
              {
                key: '2',
                icon: <AppstoreOutlined />,
                label: <Link to={`/store/${storeID.id}/product`}>Product</Link>,
              }
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
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
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