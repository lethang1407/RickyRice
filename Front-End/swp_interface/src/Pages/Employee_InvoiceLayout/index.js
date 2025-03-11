import React, { useEffect, useState } from 'react';
import InvoiceList from './components/invoiceList';
import InvoiceCreate from './components/invoiceCreate';
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
import { Button, Layout, Menu, theme, Dropdown, notification, message  } from 'antd';
import './styleInvoices.css';
import CustomFooter from "../../Components/Footer";
import { useWebSocket } from '../../Utils/Websocket/WebsocketContextProvider';
import { openNotification } from '../../Utils/AntdNotification';
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const Employee_Invoices = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('invoicesList');
    const { messages } = useWebSocket();
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(()=>{
        if(messages){
            openNotification(api,messages.message)
        }
    },[messages])

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {contextHolder}
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
                        defaultSelectedKeys={['4']}
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
                        <SubMenu key="4" icon={<TeamOutlined />} title="Hóa Đơn" onClick={() => handleNavigation('/employee/invoices')}>
                            <Menu.Item key="4-1" onClick={() => setSelectedMenu('invoicesList')}>
                                Danh Sách Hóa Đơn
                            </Menu.Item>
                            <Menu.Item key="4-2" onClick={() => setSelectedMenu('createInvoice')}>
                                Tạo Hóa Đơn Xuất
                            </Menu.Item>
                            <Menu.Item key="4-3" onClick={() => setSelectedMenu('canceledInvoices')}>
                                Tạo Hóa Đơn Nhập
                            </Menu.Item>
                        </SubMenu>

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
                            margin: '8px 8px',
                            padding: 15,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >

                        {selectedMenu === 'invoicesList' && <InvoiceList />}
                        {selectedMenu === 'createInvoice' && <InvoiceCreate />}
                        {selectedMenu === 'canceledInvoices' && <h2>Tạo Hóa Đơn Xuất</h2>}

                    </Content>

                </Layout>
            </Layout>
            <CustomFooter />
        </div>
    );
};
export default Employee_Invoices;