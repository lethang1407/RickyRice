import React, { useEffect, useState } from "react";
import InvoiceList from "./components/invoiceList";
import InvoiceCreate from "./components/invoiceCreate";
import InvoiceCreateToImportRice from "./components/invoiceCreateToImportRice";
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
import logo from "../../assets/img/logo-no-background.png";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  Layout,
  Menu,
  theme,
  Dropdown,
  notification,
  message,
} from "antd";
import "./styleInvoices.css";
import CustomFooter from "../../Components/Footer";
import { useWebSocket, WebSocketProvider } from "../../Utils/Websocket/WebsocketContextProvider";
import { openNotification } from "../../Utils/AntdNotification";
import NavbarAccount from "../Account/NavbarAccount";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const Employee_Invoices = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("invoicesList");
  const { messages } = useWebSocket();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (messages) {
      openNotification(api, messages.message);
    }
  }, [messages]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {contextHolder}
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
          <Menu theme="light" mode="inline" defaultSelectedKeys={["4"]}>
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
            <SubMenu
              key="4"
              icon={<SolutionOutlined />}
              title="Hóa Đơn"
              onClick={() => handleNavigation("/employee/invoices")}
            >
              <Menu.Item
                key="4-1"
                onClick={() => setSelectedMenu("invoicesList")}
              >
                Danh Sách Hóa Đơn
              </Menu.Item>
              <Menu.Item
                key="4-2"
                onClick={() => setSelectedMenu("createInvoice")}
              >
                Tạo Hóa Đơn Xuất
              </Menu.Item>
              <Menu.Item
                key="4-3"
                onClick={() => setSelectedMenu("canceledInvoices")}
              >
                Tạo Hóa Đơn Nhập
              </Menu.Item>
            </SubMenu>
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
              margin: "8px 8px",
              padding: 15,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {selectedMenu === "invoicesList" && <InvoiceList />}
            {selectedMenu === "createInvoice" && <InvoiceCreate />}
            {selectedMenu === "canceledInvoices" && (
              <InvoiceCreateToImportRice />
            )}
          </Content>
        </Layout>
      </Layout>
      <CustomFooter />
    </div>
  );
};
export default Employee_Invoices;
