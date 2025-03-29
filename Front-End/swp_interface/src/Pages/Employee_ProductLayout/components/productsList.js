import React, { useState, useEffect } from "react";
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
import logo from "../../../../src/assets/img/logo-no-background.png";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  Layout,
  Menu,
  theme,
  Input,
  Space,
  Tag,
  Select,
  Image,
} from "antd";
import CustomFooter from "../../../../src/Components/Footer";
import { Table, Spin } from "antd";
import API from "../../../Utils/API/API";
import { getToken } from "../../../Utils/UserInfoUtils";
import moment from "moment";
import "../ProductIndex.css";
import NavbarAccount from "../../Account/NavbarAccount";
import { WebSocketProvider } from "../../../Utils/Websocket/WebsocketContextProvider";

const { Header, Sider, Content } = Layout;

const Employee_Products = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [sortInfo, setSortInfo] = useState({ field: "price", order: false });
  const token = getToken();
  const [minQuantity, setMinQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState();

  const [attributeOptions, setAttributeOptions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = attributeOptions.filter(
    (o) => !selectedItems.includes(o)
  );
  const handleNavigation = (path) => {
    navigate(path);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1,
      width: "5%",
      align: 'center'
    },
    {
      title: "Ảnh Sản Phẩm",
      dataIndex: "productImage",
      key: "productImage",
      width: "12%",
      align: 'center',
      render: (productImage) =>
        productImage ? (
          <Image width={100} height={70} src={productImage} />
        ) : (
          <Image
            width={100}
            height={70}
            src="error"
            fallback="data:image/png;base64,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"
          />
        ),
    },
    {
      title: "Gạo",
      dataIndex: "name",
      key: "name",
      width: "13%",
    },
    {
      title: "Số Lượng ",
      dataIndex: "quantity",
      key: "quantity",
      width: "7%",
      align: 'center',
    },
    {
      title: "Mô Tả",
      dataIndex: "information",
      key: "information",
      width: "23%",
    },
    {
      title: "Giá Gạo",
      dataIndex: "price",
      sorter: true,
      render: (price) => `${price.toLocaleString()} đ`,
      key: "price",
      width: "8%",
      align: 'center',
    },
    {
      title: "Tính Chất",
      key: "employeeProductAttributeDTO",
      dataIndex: "employeeProductAttributeDTO",
      width: "15%",
      render: (employeeProductAttributeDTO) =>
        employeeProductAttributeDTO ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {employeeProductAttributeDTO.map((attribute, index) => (
              <Tag
                key={index}
                color={getColorForAttribute(attribute.value)}
                style={{
                  fontSize: "12px",
                  padding: "5px 10px",
                  borderRadius: "10px",
                }}
              >
                {attribute.value}
              </Tag>
            ))}
          </div>
        ) : (
          <Tag color="default">N/A</Tag>
        ),
    },
    {
      title: "Loại Gạo",
      key: "categoryname",
      width: "10%",
      align: 'center',
      render: (text, record) => (
        <span>{record.employeeCategoryDTO?.name || "N/A"}</span>
      ),
      filters: [
        { text: "Gạo Jasmine", value: "Gạo Jasmine" },
        { text: "Gạo Hấp", value: "Gạo Hấp" },
        { text: "Gạo Lứt", value: "Gạo Lứt" },
        { text: "Gạo Basmati", value: "Gạo Basmati" },
        { text: "Nếp", value: "Nếp" },
      ],
      onFilter: (value, record) => record.employeeCategoryDTO?.name === value,
    },
    {
      title: "Chỉnh Sửa Lúc",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) =>
        text ? moment(Number(text)).format("DD/MM/YYYY HH:mm:ss") : "N/A",
      width: "15%",
    },
  ];

  const getColorForAttribute = (value) => {
    switch (value.toLowerCase()) {
      case "dẻo mềm":
        return "green";
      case "dễ bảo quản":
        return "blue";
      case "thơm tự nhiên":
        return "pink";
      case "hạt dài":
        return "volcano";
      case "nấu nhanh":
        return "orange";
      case "nguyên cám":
        return "pink";
      case "chống oxy hóa":
        return "grey";
      case "giàu dinh dưỡng":
        return "green";
      default:
        return "default";
    }
  };

  const fetchAttributeOptions = async () => {
    try {
      const response = await axios.get(API.EMPLOYEE.GET_PRODUCT_ATTRIBUTES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const options = response.data.map((item) => item.value);
      setAttributeOptions(options);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thuộc tính từ API:", error);
    }
  };

  const handleSearch = async (page, size) => {
    try {
      const response = await axios.get(API.EMPLOYEE.GET_PRODUCTS_BY_NAME, {
        params: {
          name: isSearch ? searchTerm : "",
          page: page - 1,
          size: size,
          sortBy: sortInfo.field,
          descending: sortInfo.order,
          minQuantity: minQuantity || undefined,
          maxQuantity: maxQuantity || undefined,
          attributes: selectedItems.join(","),
        },
        headers: {
          Authorization: `Bearer ${token}`, // Thêm dấu backtick để sử dụng template string
        },
      });
      console.log("Search response:", response.data);
      setProducts(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error("Lỗi khi gọi API tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAttributeChange = (newSelectedItems) => {
    setSelectedItems(newSelectedItems);
    setCurrentPage(1);
    handleSearch(1, pageSize);
  };
  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    setSortInfo({
      field: sorter?.field || "price",
      order: sorter?.order === "descend",
    });
    setCurrentPage(current);
    setPageSize(pageSize);
    handleSearch(current, pageSize, sorter);
  };
  useEffect(() => {
    fetchAttributeOptions();
  }, []);
  useEffect(() => {
    handleSearch(currentPage, pageSize);
  }, [currentPage, pageSize, sortInfo]);
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
          <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
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
              onClick={() => handleNavigation("/employee/customer-debt")}
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
                <i>Danh mục sản phẩm của cửa hàng</i>
              </h3>
            </div>
            <div className="filter-container">
              <Space size="middle">
                <Select
                  className="selectFilter"
                  mode="multiple"
                  placeholder="Chọn tính chất gạo"
                  value={selectedItems}
                  onChange={handleAttributeChange}
                  style={{ width: "100%" }}
                  options={filteredOptions.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "20px",
                    color: "#6B7012",
                  }}
                >
                  <span>Số Lượng Tối Thiểu :</span>
                  <Input
                    type="number"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(e.target.value)}
                    placeholder="Nhập min"
                    style={{ width: 150 }}
                    allowClear
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "20px",
                    color: "#6B7012",
                  }}
                >
                  <span>Số Lượng Tối Đa :</span>
                  <Input
                    type="number"
                    value={maxQuantity}
                    onChange={(e) => setMaxQuantity(e.target.value)}
                    placeholder="Nhập max"
                    style={{ width: 150 }}
                    allowClear
                  />
                </div>
                <Button
                  type="primary"
                  onClick={() => {
                    setIsSearch(true);
                    handleSearch(1, pageSize);
                  }}
                >
                  Lọc Sản Phẩm
                </Button>

                <Input
                  placeholder="Tìm Tên Loại Gạo....."
                  value={searchTerm}
                  onChange={(e) => {
                    setIsSearch(false);
                    setSearchTerm(e.target.value);
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    setIsSearch(true);
                    handleSearch(1, pageSize);
                  }}
                >
                  Tìm Kiếm{" "}
                </Button>
              </Space>
            </div>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Table
                style={{ marginTop: 10 }}
                dataSource={products}
                columns={columns}
                rowClassName={(record) =>
                  record.quantity === 0 ? "row-red" : ""
                }
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalItems,
                  showSizeChanger: true,
                  pageSizeOptions: ["1", "5", "10", "20"],
                }}
                onChange={handleTableChange}
                className="custom-table"
              />
            )}
          </Content>
        </Layout>
      </Layout>
      <CustomFooter />
    </div>
  );
};
export default Employee_Products;
