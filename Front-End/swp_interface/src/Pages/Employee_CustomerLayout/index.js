import React, { useState } from 'react';
import CustomerList from './components/customerList';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  ShopOutlined,
  VideoCameraOutlined,
  InsertRowBelowOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import logo from '../../assets/img/logoviet.png';
import { useNavigate } from 'react-router-dom';
import { Button, Layout, Menu, theme, Dropdown } from 'antd';
import './style.css';
import CustomFooter from "../../Components/Footer";
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
            <img style={{ width: '90px', marginRight: '100px' }} src={logo} alt="logo" class="header__navbar__img" />
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['3']}
          >
            <Menu.Item
              key="1"
              icon={<InsertRowBelowOutlined />}
              onClick={() => handleNavigation('/employee/products')}
            >
              Grain Selection
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<ShopOutlined />}
              onClick={() => handleNavigation('/employee/ricezone')}
            >
              Rice Zone
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<TeamOutlined />}
              onClick={() => handleNavigation('/employee/customers')}
            >
              Customer
            </Menu.Item>
          </Menu>
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

            <CustomerList />
          </Content>

        </Layout>
      </Layout>
      <CustomFooter />
    </div>
  );
};
export default Employee_Customer;