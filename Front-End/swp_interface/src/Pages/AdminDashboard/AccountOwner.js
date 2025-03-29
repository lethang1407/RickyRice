import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Select,
  Pagination,
  Spin,
  Row,
  Col,
  Button,
  message,
} from "antd";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import API from "../../Utils/API/API.js";
import { getToken } from "../../Utils/UserInfoUtils";

const { Option } = Select;

const AccountOwner = ({ setTotalAccounts }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API.ADMIN.GET_ALL_ACCOUNT}?page=${
            currentPage - 1
          }&size=${recordsPerPage}&search=${searchQuery}&isActive=${statusFilter}&gender=${genderFilter}&sortBy=${sortBy}&sortDirection=${sortOrder}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );

        const storeOwners = response.data.data.storeOwners.content || [];
        setUserData(storeOwners);

        // Cập nhật tổng số tài khoản và số bản ghi
        const total = response.data.data.storeOwners.totalElements || 0;
        setTotalRecords(total);

        if (setTotalAccounts) {
          setTotalAccounts(total);
        }
      } catch (err) {
        console.error(
          "API Error:",
          err.response ? err.response.data : err.message
        );
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    currentPage,
    recordsPerPage,
    searchQuery,
    statusFilter,
    genderFilter,
    sortBy,
    sortOrder,
    setTotalAccounts,
  ]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy === field) {
      return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const handleStatusUpdate = async (id, isActive) => {
    try {
      const response = await axios.patch(
        API.ADMIN.UPDATE_ACCOUNT_STATUS,
        { id, isActive: !isActive },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.code === 200) {
        message.success("Cập nhật trạng thái thành công!");

        setUserData((prevData) =>
          prevData
            .map((user) =>
              user.accountID === id ? { ...user, isActive: !isActive } : user
            )
            .filter((user) => {
              if (statusFilter === "true") return user.isActive;
              if (statusFilter === "false") return !user.isActive;
              return true;
            })
        );
      } else {
        message.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      message.error("Lỗi cập nhật trạng thái!");
    }
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "username",
      key: "username",
      width: 110,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      align: "center",
    },
    {
      title: (
        <span
          onClick={() => handleSort("createdAt")}
          style={{ cursor: "pointer" }}
        >
          Ngày tạo {renderSortIcon("createdAt")}
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 110,
      align: "center",
      render: (text) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 120,
      align: "center",
      render: (text) =>
        text === null ? "Không xác định" : text ? "Nam" : "Nữ",
    },
    {
      title: (
        <span
          onClick={() => handleSort("birthDate")}
          style={{ cursor: "pointer" }}
        >
          Ngày sinh {renderSortIcon("birthDate")}
        </span>
      ),
      dataIndex: "birthDate",
      key: "birthDate",
      width: 110,
      align: "center",
      render: (text) => text || "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 150,
      align: "center",
      render: (text) => (
        <span style={{ color: text ? "green" : "red", fontWeight: "bold" }}>
          {text ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 160,
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          danger={record.isActive}
          onClick={() => handleStatusUpdate(record.accountID, record.isActive)}
          style={{ width: "100px" }}
        >
          {record.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
        </Button>
      ),
    },
  ];

  return (
    <div className="mt-3 container">
      <h2 className="mb-4 text-center"> Tài khoản của chủ cửa hàng</h2>
      <Row gutter={16} className="mb-3">
        <Col span={8}>
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: "100%" }}
          >
            <Option value="">Tất cả trạng thái</Option>
            <Option value="true">Hoạt động</Option>
            <Option value="false">Không hoạt động</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Select
            value={genderFilter}
            onChange={setGenderFilter}
            style={{ width: "100%" }}
          >
            <Option value="">Tất cả giới tính</Option>
            <Option value="true">Nam</Option>
            <Option value="false">Nữ</Option>
          </Select>
        </Col>
      </Row>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Table
          columns={columns}
          dataSource={userData}
          rowKey="accountID"
          pagination={false}
          bordered
        />
      )}
      <br />
      <Row className="mb-3" justify="space-between" align="middle">
        <Col>
          <Pagination
            current={currentPage}
            pageSize={recordsPerPage}
            onChange={(page) => setCurrentPage(page)}
            total={totalRecords}
          />
        </Col>
        <Col>
          <Select
            value={recordsPerPage}
            onChange={(value) => {
              setRecordsPerPage(value);
              setCurrentPage(1);
            }}
            style={{ width: "150px" }}
          >
            <Option value={5}>5 bản ghi</Option>
            <Option value={10}>10 bản ghi</Option>
            <Option value={20}>20 bản ghi</Option>
          </Select>
        </Col>
      </Row>
    </div>
  );
};

export default AccountOwner;
