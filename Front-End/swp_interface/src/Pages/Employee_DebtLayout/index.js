import React, { useState } from 'react';
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
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import '../../Components/Layout/style.css';
import CustomFooter from '../../Components/Footer/index';
import CustomerDebt from '../Debt/CustomerDebt/customer';
import { useNavigate } from 'react-router-dom';
const { Header, Sider, Content } = Layout;

const DebtEmploy = () => {
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Layout style={{minHeight:'100vh'}}>
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
                        defaultSelectedKeys={['5']}
                    >
                        <Menu.Item
                            key="1"
                            icon={<InsertRowBelowOutlined />}
                            onClick={() => handleNavigation('/employee/products')}
                        >
                            Sản Phẩm Gạo
                        </Menu.Item>
                        <Menu.Item
                            key="2"
                            icon={<ShopOutlined />}
                            onClick={() => handleNavigation('/employee/ricezone')}
                        >
                            Khu Vực Gạo
                        </Menu.Item>
                        <Menu.Item
                            key="3"
                            icon={<TeamOutlined />}
                            onClick={() => handleNavigation('/employee/customers')}
                        >
                            Khách Hàng
                        </Menu.Item>
                        <Menu.Item
                            key="4"
                            icon={<SolutionOutlined />}
                            onClick={() => handleNavigation('/employee/invoices')}
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
            <CustomerDebt/>
          </Content>
        </Layout>
      </Layout>
      <CustomFooter />
    </div>
  );
};
export default DebtEmploy;