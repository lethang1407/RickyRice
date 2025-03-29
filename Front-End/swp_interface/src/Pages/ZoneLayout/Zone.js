import React, { useState, useEffect } from "react";
import logo from "../../assets/img/logo-no-background.png";
import { Table, Input, Image } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { Pagination } from "antd";
import debounce from "lodash.debounce";
import moment from "moment";
import "./ZoneIndex.css";
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
import axios from "axios";
import { Spin, List as ListItem } from "antd";
import {
  Button,
  Layout,
  Menu,
  theme,
  SearchOutlined,
  Select,
  Space,
  Modal,
} from "antd";
import CustomFooter from "../../Components/Footer";
import Search from "antd/es/transfer/search";

import { getToken } from "../../Utils/UserInfoUtils";
import API from "../../Utils/API/API";
import NavbarAccount from "../Account/NavbarAccount";
import { WebSocketProvider } from "../../Utils/Websocket/WebsocketContextProvider";

const { Header, Sider, Content } = Layout;

const ZoneList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [zone, setZone] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [selectedZoneName, setSelectedZoneName] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorterState, setSorterState] = useState(null);
  const token = getToken();

  const [filters, setFilters] = useState({
    quantityMin: null,
    quantityMax: null,
    sizeMin: null,
    sizeMax: null,
  });

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    fetchZone(currentPage, pageSize, filters, null, searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  const Zonecolumns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1,
      width: "5%",
      align: "center",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "15%",
    },
    {
      title: "Vị Trí",
      dataIndex: "location",
      sorter: true,
      key: "location",
      width: "15%",
      align: "center",
    },
    {
      title: "Chỉnh Sửa Lúc",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) =>
        text ? moment(Number(text)).format("HH:mm:ss DD/MM/YYYY") : "N/A",
      width: "15%",
      align: "center",
    },
    {
      title: "Cửa Hàng",
      key: "actions",
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => {
            showModal(record);
          }}
        >
          Thông tin
        </Button>
      ),
      width: "15%",
      align: "center",
    },
  ];
  const ZoneIN4columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1,
    },
    {
      title: "ID Cửa Hàng",
      dataIndex: "storeID",
      key: "storeID",
    },

    {
      title: "Hình Ảnh Cửa Hàng ",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <Image width={100} height={70} src={image} />
        ) : (
          <Image
            width={80}
            height={40}
            src="error"
            fallback="data:image/png;base64,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"
          />
        ),
    },
    {
      title: "Tên",
      dataIndex: "storeName",
      key: "name",
    },

    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Hotline",
      dataIndex: "hotline",
      key: "hotline",
    },
    {
      title: "Giờ Mở Cửa",
      dataIndex: "operatingHour",
      key: "operatingHour",
    },
    {
      title: "Trạng Thái ",
      dataIndex: "operatingHour",
      key: "operatingHour",
      render: (text, record) => {
        const currentTime = moment();
        const [start, end] = text.split("-");
        const startTime = moment(start, "h A");
        const endTime = moment(end, "h A");
        const isOpen = currentTime.isBetween(startTime, endTime);

        return (
          <span style={{ color: isOpen ? "green" : "red", fontWeight: "bold" }}>
            {isOpen ? "Cửa Hàng Đang Mở " : "Cửa Hàng Đã Đóng"}
          </span>
        );
      },
    },
  ];

  const handleFilterChange = (type, value) => {
    setFilters({ ...filters, [type]: value });
  };
  const handleFilterSubmit = () => {
    fetchZone(currentPage, pageSize, filters, null, searchTerm);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
    setLoading(true);
    fetchZone(currentPage, pageSize, filters, null, searchTerm);
  }, 1500);

  const handleTableChange = (pagination, _, sorter) => {
    const { current, pageSize } = pagination;
    const sortBy = sorter.columnKey || "size";
    const sortOrder = sorter.order
      ? sorter.order === "ascend"
        ? "false"
        : "true"
      : "false";

    setCurrentPage(current);
    setPageSize(pageSize);
    setSorterState({
      field: sortBy,
      order: sortOrder,
    });
    fetchZone(
      current,
      pageSize,
      filters,
      {
        field: sorter.columnKey,
        order: sortOrder,
      },
      searchTerm
    );
  };
  // 'http://localhost:9999/employee/ricezone'
  const fetchZone = async (page, size, filters, sorter, search) => {
    const { field, order } = sorter || sorterState || {};
    try {
      const response = await axios.get(API.EMPLOYEE.GET_RICEZONE, {
        params: {
          page: page - 1,
          size: size,
          sortBy: field,
          sortOrder: order || false,
          search: search || "",
        },
        headers: {
          Authorization: `Bearer ${token}`, // Chèn token vào header
        },
      });
      console.log("Dữ liệu liên quan22:", response.data);
      console.log(response.data.content);
      setZone(response.data.content);

      setTotalItems(response.data.totalElements);
      setLoading(false); //false la trang thai  loading data xong
    } catch (error) {
      console.error("nổ rồi các cháu ơi, lỗi lỗi lỗi", error);
      setLoading(false);
    }
  };

  const showModal = (zone) => {
    setModalData(zone.employeeStoreDTO ? [zone.employeeStoreDTO] : []);
    setSelectedZoneName(zone.name);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
          <Menu theme="light" mode="inline" defaultSelectedKeys={["2"]}>
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
            <WebSocketProvider>
              <NavbarAccount />
            </WebSocketProvider>
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "0 15px",
              }}
            >
              <h3 style={{ textAlign: "center", margin: 0, color: "#E3C584" }}>
                <i>Khu Vực Chứa Gạo </i>
              </h3>
              <Space.Compact
                style={{
                  width: "20%",
                }}
              >
                <Input
                  placeholder="Tìm kiếm khu vực..."
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                <Button type="primary">Tìm Kiếm</Button>
              </Space.Compact>
            </div>

            {loading ? (
              <Spin size="large" />
            ) : (
              <Table
                style={{ marginTop: 45 }}
                dataSource={zone}
                columns={Zonecolumns}
                rowClassName={(record) =>
                  record.quantity === 0 ? "row-red" : ""
                }
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalItems,
                  showSizeChanger: true,
                  pageSizeOptions: ["1", "5", "10"],
                  onChange: (page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                    fetchZone(page, size, filters, null, searchTerm);
                  },
                }}
                onChange={handleTableChange}
                className="custom-table"
              />
            )}
          </Content>
        </Layout>
      </Layout>

      <Modal
        title={
          <span style={{ fontWeight: 500, fontSize: "18px", color: "#E3C584" }}>
            {" "}
            Cửa Hàng Của : {selectedZoneName}
          </span>
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
        style={{ top: 300, left: 40 }}
        width="75%"
        bodyStyle={{ height: "10vh" }}
      >
        <Table
          dataSource={modalData}
          columns={ZoneIN4columns}
          rowKey={(record) => record.storeID}
          pagination={false}
        />
      </Modal>

      <CustomFooter />
    </div>
  );
};
export default ZoneList;
