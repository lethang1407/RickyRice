import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Pagination, Select, Row, Col } from "antd";
import { getToken } from "../../../Utils/UserInfoUtils";

const { Option } = Select;

const PaymentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [plans, setPlans] = useState(["All"]);
  const [selectedPlan, setSelectedPlan] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const token = getToken();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      let url = `http://localhost:9999/store-owner/payment-transaction?page=${
        page - 1
      }&size=${recordsPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
      if (selectedPlan && selectedPlan !== "All") {
        url += `&subscriptionPlanName=${selectedPlan}`;
      }

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.code === 200) {
          setTransactions(data.data.statistics.content);
          setTotalPages(data.data.statistics.totalPages);
          setPlans(["All", ...data.data.subcriptionPlans]);
        } else {
          
        }
      } catch {
        setError("Lỗi kết nối API");
      }
      setLoading(false);
    };
    fetchTransactions();
  }, [page, selectedPlan, sortBy, sortDirection, recordsPerPage]);

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" showIcon />;

  const columns = [
    {
      title: "Ngày thanh toán",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      align: "center",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: "Mã giao dịch",
      dataIndex: "transactionNo",
      key: "transactionNo",
      width: 150,
      align: "center",
    },
    {
      title: "Gói dịch vụ",
      dataIndex: "subcriptionPlanName",
      key: "subcriptionPlanName",
      width: 150,
      align: "center",
    },
    {
      title: "Giá (VND)",
      dataIndex: "subcriptionPlanPrice",
      key: "subcriptionPlanPrice",
      width: 170,
      align: "center",
      render: (price) => `${price.toLocaleString()}`,
      sorter: true,
    },
    {
      title: "Mô tả",
      dataIndex: "subcriptionDescription",
      key: "subcriptionDescription",
    },
  ];

  return (
    <div className="mt-3 container">
      <h2 className="mb-4 text-center">Lịch sử giao dịch</h2>
      <Select
        style={{ width: 200, marginBottom: 16, textAlign: "center" }}
        placeholder="Chọn kế hoạch"
        value={selectedPlan}
        onChange={(value) => {
          setSelectedPlan(value);
          setPage(1);
        }}
        dropdownStyle={{ textAlign: "center" }}
      >
        {plans.map((plan) => (
          <Option key={plan} value={plan} style={{ textAlign: "center" }}>
            {plan === "All" ? "Gói đăng kí" : plan}
          </Option>
        ))}
      </Select>

      <Table
        dataSource={transactions}
        columns={columns}
        rowKey="appStatisticsID"
        pagination={false}
        bordered
        onChange={(pagination, filters, sorter) => {
          if (sorter.order) {
            setSortBy(sorter.columnKey);
            setSortDirection(sorter.order === "ascend" ? "asc" : "desc");
          } else {
            setSortBy("createdAt");
            setSortDirection("desc");
          }
          setPage(1);
        }}
      />
      <br />
      <Row className="mb-3" justify="space-between" align="middle">
        <Col>
          <Pagination
            current={page}
            total={totalPages * recordsPerPage}
            pageSize={recordsPerPage}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </Col>
        <Col>
          <Select
            value={recordsPerPage}
            onChange={(value) => {
              setRecordsPerPage(value);
              setPage(1);
            }}
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

export default PaymentTransactions;
