import React, { useState, useEffect, useMemo } from "react";
import { Table, Form, Pagination } from "react-bootstrap";
import axios from "axios";
import API from "../../Utils/API/API.js";
import { getToken } from "../../Utils/UserInfoUtils";

const RevenueStatistics = ({ setTotalRevenue }) => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const token = getToken();

  useEffect(() => {
    axios
      .get(API.ADMIN.VIEW_REVENUE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.code === 200) {
          const data = response.data.data.filter(
            (item) => item.createdBy && item.createdAt && item.transactionNo
          );
          setRevenueData(data);
          setTotalRevenue(
            data.reduce((sum, item) => sum + item.subcriptionPlanPrice, 0)
          );
        } else {
          setError("Không thể lấy dữ liệu");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError("Lỗi khi lấy dữ liệu");
      })
      .finally(() => setLoading(false));
  }, [setTotalRevenue, token]);

  const handleSort = (key) => {
    setSortBy(key);
    setSortOrder(sortBy === key && sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredData = useMemo(() => {
    return revenueData.filter((item) =>
      [item.storeName, item.subcriptionPlanName, item.createdBy]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [revenueData, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (typeof a[sortBy] === "number") {
        return sortOrder === "asc"
          ? a[sortBy] - b[sortBy]
          : b[sortBy] - a[sortBy];
      }
      return sortOrder === "asc"
        ? a[sortBy].localeCompare(b[sortBy])
        : b[sortBy].localeCompare(a[sortBy]);
    });
  }, [filteredData, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / recordsPerPage);
  const currentRecords = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [sortedData, currentPage, recordsPerPage]);

  return (
    <div>
      <h3 className="mt-5">Thống kê giao dịch</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo gói đăng kí, người tạo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2"
          style={{ width: "500px" }}
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
                <th>Gói đăng kí</th>
                <th>Giá (VND)</th>
                <th>Mô tả</th>
                <th>Thời hạn (Tháng)</th>
                <th onClick={() => handleSort("createdBy")}>
                  Người tạo{" "}
                  {sortBy === "createdBy"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "⇅"}
                </th>
                <th>Ngày tạo</th>
                <th>Mã giao dịch</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((item) => (
                  <tr key={item.appStatisticsID}>
                    <td>{item.subcriptionPlanName}</td>
                    <td className="text-right">
                      {item.subcriptionPlanPrice.toLocaleString()}
                    </td>
                    <td>{item.subcriptionDescription}</td>
                    <td className="text-center">
                      {item.subcriptionTimeOfExpiration}
                    </td>
                    <td>{item.createdBy ? item.createdBy : "N/A"}</td>
                    <td>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{item.transactionNo ? item.transactionNo : "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    Không có giao dịch được tìm thấy
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default RevenueStatistics;
