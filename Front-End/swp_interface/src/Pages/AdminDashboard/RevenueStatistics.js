import React, { useState, useEffect } from "react";
import { Table, Form, Pagination } from "react-bootstrap";
import axios from "axios";
import { getToken } from "../../Utils/UserInfoUtils";

const API_URL = "http://localhost:9999/admin/test-revenue";

const RevenueStatistics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscriptionPlanName, setSubscriptionPlanName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionPlanOptions, setSubscriptionPlanOptions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const token = getToken();

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL, {
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
          const { statistics, totalRevenue } = response.data.data;
          setRevenueData(statistics.content);
          setTotalRecords(statistics.totalElements);
          setTotalRevenue(totalRevenue); // Cập nhật tổng doanh thu từ API
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

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  return (
    <div>
      <h3 className="mt-5">Thống kê giao dịch</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Dropdown cho Subscription Plan Name */}
        <Form.Select
          value={subscriptionPlanName}
          onChange={(e) => setSubscriptionPlanName(e.target.value)}
          className="me-2"
          style={{ width: "250px" }}
        >
          <option value="">Tất cả gói đăng ký</option>
          {subscriptionPlanOptions.map((plan) => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
        </Form.Select>

        {/* Thanh tìm kiếm dùng chung cho createdBy và transactionNo */}
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo người tạo hoặc mã giao dịch"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="me-2"
          style={{ width: "350px" }}
        />

        <div className="d-flex align-items-center">
          <Form.Select
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ width: "80px" }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </Form.Select>
          <span className="ms-2">bản ghi / trang</span>
        </div>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th onClick={() => handleSort("subcriptionPlanName")}>
                  Gói đăng kí ⇅
                </th>
                <th onClick={() => handleSort("subcriptionPlanPrice")}>
                  Giá (VND) ⇅
                </th>
                <th>Mô tả</th>
                <th>Thời hạn (Tháng)</th>
                <th onClick={() => handleSort("createdBy")}>Người tạo ⇅</th>
                <th onClick={() => handleSort("createdAt")}>Ngày tạo ⇅</th>
                <th onClick={() => handleSort("transactionNo")}>
                  Mã giao dịch ⇅
                </th>
              </tr>
            </thead>
            <tbody>
              {revenueData.length > 0 ? (
                revenueData.map((item) => (
                  <tr key={item.appStatisticsID}>
                    <td>{item.subcriptionPlanName}</td>
                    <td className="text-right">
                      {item.subcriptionPlanPrice.toLocaleString()}
                    </td>
                    <td>{item.subcriptionDescription}</td>
                    <td className="text-center">
                      {item.subcriptionTimeOfExpiration}
                    </td>
                    <td>{item.createdBy || "N/A"}</td>
                    <td>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{item.transactionNo || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    Không có giao dịch được tìm thấy
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <Pagination className="mt-3">
            {[...Array(totalPages).keys()].map((num) => (
              <Pagination.Item
                key={num + 1}
                active={num + 1 === currentPage}
                onClick={() => setCurrentPage(num + 1)}
              >
                {num + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
};

export default RevenueStatistics;
