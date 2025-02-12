import React, { useState } from 'react';
import {
  FileDoneOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProductOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import './style.css';
import CustomFooter from '../../Footer';
import { Link, Outlet } from 'react-router-dom';
import { hover } from 'framer-motion';
const { Header, Sider, Content } = Layout;

const StoreOwnerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Layout>
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
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <UserOutlined />,
                label: <Link to="/home/store-owner/store" style={{textDecoration:'none'}}>Store</Link>,
              },
              {
                key: '2',
                icon: <FileDoneOutlined />,
                label: <Link to="/home/store-owner/invoice" style={{textDecoration:'none'}}>Invoie</Link>,
              },
              {
                key: '3',
                icon: <ProductOutlined />,
                label: <Link to="/home/store-owner/product" style={{textDecoration:'none'}}>Product</Link>,
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
export default StoreOwnerLayout;