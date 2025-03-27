import React, { useState, useEffect, useCallback } from "react";
import { Table, Spin, Alert, Row, Col, Input, Select, Pagination } from "antd";
import axios from "axios";
import StoreDetailModal from "./components/StoreDetailModal.js";
import API from "../../Utils/API/API.js";
import { getToken } from "../../Utils/UserInfoUtils";

const { Option } = Select;

const AdminViewStores = () => {
  const token = getToken();
  const [stores, setStores] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [totalStores, setTotalStores] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API.ADMIN.VIEW_ALL_STORE}?page=${
          currentPage - 1
        }&size=${recordsPerPage}&searchQuery=${searchQuery}&subscriptionPlanName=${
          subscriptionFilter !== "All" ? subscriptionFilter : ""
        }&sortBy=${sortBy}&sortDirection=${sortDirection}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.code === 200) {
        const data = response.data.data;
        setStores(data.stores.content);
        setSubscriptionPlans(data.subscriptionPlans);
        setTotalStores(data.stores.totalElements);
      } else {
        setError("Failed to fetch store data");
      }
    } catch (err) {
      setError("Error fetching store data");
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    subscriptionFilter,
    sortBy,
    sortDirection,
    currentPage,
    recordsPerPage,
    token,
  ]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      setSortBy(sorter.field);
      setSortDirection(sorter.order === "ascend" ? "asc" : "desc");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 50,
      render: (_, __, index) => index + 1 + (currentPage - 1) * recordsPerPage,
    },
    {
      title: "Tên cửa hàng",
      dataIndex: "storeName",
      width: 150,
      align: "center",
      key: "storeName",
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expireAt",
      width: 150,
      key: "expireAt",
      align: "center",
      render: (text) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "N/A",
      sorter: true,
    },
    {
      title: "Chủ cửa hàng",
      dataIndex: "accountName",
      align: "center",
      key: "accountName",
    },
    {
      title: "Gói đăng kí",
      dataIndex: "subscriptionPlanName",
      align: "center",
      key: "subscriptionPlanName",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 150,
      align: "center",
      key: "createdAt",
      render: (text) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "N/A",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updateAt",
      width: 150,
      align: "center",
      key: "updateAt",
      render: (text) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "N/A",
      sorter: true,
    },
    {
      title: "Giá (VND)",
      dataIndex: "subscriptionPlanPrice",
      key: "subscriptionPlanPrice",
      align: "center",
      render: (price) => (price ? price.toLocaleString("de-DE") : "0"),
      sorter: true,
    },
    {
      title: "Thời hạn sử dụng (Tháng)",
      dataIndex: "subscriptionTimeOfExpiration",
      width: 150,
      align: "center",
      key: "subscriptionTimeOfExpiration",
    },
  ];

  return (
    <div className="mt-4">
      <h2 className="mb-4 text-center">Danh sách cửa hàng</h2>

      <Row gutter={16} className="mb-3" justify="space-between" align="middle">
        <Col span={12}>
          <Input
            placeholder="Tìm kiếm theo tên cửa hàng, chủ cửa hàng"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Select
            value={subscriptionFilter}
            onChange={setSubscriptionFilter}
            style={{ width: "100%" }}
          >
            <Option value="All">Tất cả gói đăng kí</Option>
            {subscriptionPlans.map((plan) => (
              <Option key={plan} value={plan}>
                {plan}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <>
          <Table
            dataSource={stores}
            columns={columns}
            rowKey="storeID"
            pagination={false}
            bordered
            onChange={handleTableChange}
            onRow={(record) => ({
              onClick: () => {
                setSelectedStore(record);
                setShowModal(true);
              },
            })}
          />
          <br />
          <Row className="mb-3" justify="space-between" align="middle">
            <Col>
              <Pagination
                current={currentPage}
                total={totalStores}
                pageSize={recordsPerPage}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </Col>
            <Col>
              <Select
                value={recordsPerPage}
                onChange={(value) => {
                  setRecordsPerPage(value);
                  setCurrentPage(1);
                }}
              >
                <Option value={5}>5 bản ghi</Option>
                <Option value={10}>10 bản ghi</Option>
                <Option value={20}>20 bản ghi</Option>
              </Select>
            </Col>
          </Row>
        </>
      )}

      <StoreDetailModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        store={selectedStore}
      />
    </div>
  );
};

export default AdminViewStores;
