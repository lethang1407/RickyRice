import React, { useState, useEffect } from "react";
import { Table, Select, Input, Pagination } from "antd";
import axios from "axios";
import { getToken } from "../../Utils/UserInfoUtils";
import API from "../../Utils/API/API.js";

const RevenueStatistics = ({ setTotalRevenue }) => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscriptionPlanName, setSubscriptionPlanName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionPlanOptions, setSubscriptionPlanOptions] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const token = getToken();

  useEffect(() => {
    setLoading(true);
    axios
      .get(API.ADMIN.VIEW_REVENUE, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage - 1,
          size: recordsPerPage,
          sortBy,
          sortDirection: sortOrder,
          subscriptionPlanName: subscriptionPlanName || undefined,
          searchQuery: searchQuery || undefined,
        },
      })
      .then((response) => {
        if (response.data.code === 200) {
          const { statistics, totalRevenue, subcriptionPlans } =
            response.data.data;
          setRevenueData(statistics.content);
          setTotalRecords(statistics.totalElements);
          setTotalRevenue(totalRevenue); // Cập nhật tổng doanh thu ở DashboardContent
          setSubscriptionPlanOptions(subcriptionPlans || []); // Cập nhật danh sách các gói đăng ký
        } else {
          setError("Không thể lấy dữ liệu");
        }
      })
      .catch(() => setError("Lỗi khi lấy dữ liệu"))
      .finally(() => setLoading(false));
  }, [
    currentPage,
    recordsPerPage,
    sortBy,
    sortOrder,
    subscriptionPlanName,
    searchQuery,
    setTotalRevenue,
    token,
  ]);

  const handleSort = (key) => {
    setSortBy(key);
    setSortOrder(sortBy === key && sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div style={{ minHeight: "500px" }}>
      <h3 className="mt-5">Thống kê giao dịch</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Dropdown chọn gói đăng ký */}
        <Select
          value={subscriptionPlanName}
          onChange={(value) => {
            setSubscriptionPlanName(value);
            setCurrentPage(1);
          }}
          style={{ width: 250 }}
          placeholder="Tất cả gói đăng ký"
        >
          <Select.Option value="">Tất cả gói đăng ký</Select.Option>
          {subscriptionPlanOptions.map((plan) => (
            <Select.Option key={plan} value={plan}>
              {plan}
            </Select.Option>
          ))}
        </Select>

        {/* Thanh tìm kiếm theo người tạo hoặc mã giao dịch */}
        <Input
          type="text"
          placeholder="Tìm kiếm theo người tạo hoặc mã giao dịch"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: 350 }}
        />

        <div className="d-flex align-items-center">
          <Select
            value={recordsPerPage}
            onChange={(value) => {
              setRecordsPerPage(Number(value));
              setCurrentPage(1);
            }}
            style={{ width: 80 }}
          >
            <Select.Option value="5">5</Select.Option>
            <Select.Option value="10">10</Select.Option>
            <Select.Option value="15">15</Select.Option>
          </Select>
          <span className="ms-2">bản ghi / trang</span>
        </div>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          <Table
            pagination={false} 
            dataSource={revenueData}
            bordered
            columns={[
              {
                title: "Gói đăng ký",
                dataIndex: "subcriptionPlanName",
              },
              {
                title: "Giá (VND)",
                dataIndex: "subcriptionPlanPrice",
                render: (price) => price.toLocaleString(),
                sorter: () => handleSort("subcriptionPlanPrice"),
              },
              {
                title: "Mô tả",
                dataIndex: "subcriptionDescription",
              },
              {
                title: "Thời hạn (Tháng)",
                dataIndex: "subcriptionTimeOfExpiration",
                align: "center",
              },
              {
                title: "Người tạo",
                dataIndex: "createdBy",
              },
              {
                title: "Ngày tạo",
                dataIndex: "createdAt",
                render: (date) =>
                  date ? new Date(date).toLocaleDateString() : "N/A",
                sorter: () => handleSort("createdAt"),
              },
              {
                title: "Mã giao dịch",
                dataIndex: "transactionNo",
              },
            ]}
            rowKey="appStatisticsID"
          />
          <br/>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            total={totalRecords}
            pageSize={recordsPerPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
};

export default RevenueStatistics;
