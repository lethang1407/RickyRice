import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Input,
  Row,
  Col,
  Pagination,
  Select,
  Button,
  Alert,
} from "antd";
import { getToken } from "../../Utils/UserInfoUtils";
import axios from "axios";
import { debounce } from "lodash";
import API from "../../Utils/API/API.js";
import SubscriptionPlanModal from "./components/SubscriptionPlanModal";

const { Option } = Select;

const SubscriptionPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [totalStores, setTotalStores] = useState(0);
  const [sortBy, setSortBy] = useState("price");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchName, setSearchName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const token = getToken();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API.ADMIN.VIEW_ALL_SUBSCRIPTION_PLAN}?page=${
          currentPage - 1
        }&size=${recordsPerPage}&name=${searchName}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data && response.data.data) {
        const data = response.data.data.plans;
        setPlans(data.content);
        setTotalStores(data.totalElements);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, recordsPerPage, sortBy, sortDirection, searchName, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      setSortBy(sorter.columnKey);
      setSortDirection(sorter.order === "ascend" ? "asc" : "desc");
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchName(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleCreate = async (values) => {
    try {
      const response = await axios.post(
        API.ADMIN.CREATE_SUBSCRIPTION_PLAN,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201 || response.status === 200) {
        setSuccessMessage("Tạo gói đăng ký thành công!");
        setIsModalOpen(false);
        fetchData();
        setTimeout(() => setSuccessMessage(""), 1500);
      }
    } catch (error) {
      setSuccessMessage("Lỗi khi tạo gói đăng ký!");
      setTimeout(() => setSuccessMessage(""), 1500);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      const response = await axios.put(
        API.ADMIN.UPDATE_SUBSCRIPTION_PLAN(editingPlan.subscriptionPlanID),
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setSuccessMessage("Cập nhật thành công!");
        setIsEditModalOpen(false);
        fetchData();
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    } catch (error) {
      setSuccessMessage("Lỗi khi cập nhật gói!");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name", width: 150 },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 450,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      sorter: true,
      width: 150,
    },
    {
      title: "Thời hạn sử dụng (tháng)",
      dataIndex: "timeOfExpiration",
      key: "timeOfExpiration",
      width: 150,
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive) => (isActive ? "Hiển thị" : "Ẩn"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="mt-3 container">
      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}
      <h2 className="mb-4 text-center">Gói đăng kí</h2>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Tìm kiếm theo tên"
            onChange={(e) => debouncedSearch(e.target.value)}
            style={{ width: "800px" }}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Tạo mới
          </Button>
        </Col>
      </Row>
      <Table
        rowKey="subscriptionPlanID"
        columns={columns}
        dataSource={plans}
        loading={loading}
        pagination={false}
        onChange={handleTableChange}
      />
      <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
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
      <SubscriptionPlanModal
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onFinish={handleCreate}
        title="Tạo Gói Đăng Ký Mới"
      />
      <SubscriptionPlanModal
        visible={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onFinish={handleUpdate}
        title="Cập nhật Gói Đăng Ký"
        initialValues={editingPlan}
      />
    </div>
  );
};

export default SubscriptionPlan;
