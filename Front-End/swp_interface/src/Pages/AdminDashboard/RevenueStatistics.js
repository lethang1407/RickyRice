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
  const [recordsPerPage, setRecordsPerPage] = useState(5);
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
          const data = response.data.data;
          setRevenueData(data);
          setTotalRevenue(
            data.reduce((sum, item) => sum + item.subcriptionPlanPrice, 0)
          );
        } else {
          setError("Failed to fetch data");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      })
      .finally(() => setLoading(false));
  }, [setTotalRevenue]);

  const handleSort = (key) => {
    setSortBy(key);
    setSortOrder(sortBy === key && sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredData = useMemo(() => {
    return revenueData.filter((item) =>
      [item.storeName, item.subcriptionPlanName, item.createdBy].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
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
      <h3 className="mt-5">Revenue Statistics</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Search by Store Name, Plan, or Created By"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2"
          style={{ width: "500px" }}
        />
        <div className="d-flex align-items-center">
          <Form.Label className="me-2 mb-0">Hiển thị</Form.Label>
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
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th onClick={() => handleSort("storeName")}>
                  Store Name{" "}
                  {sortBy === "storeName"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "⇅"}
                </th>
                <th>Subscription Plan</th>
                <th>Price ($)</th>
                <th>Description</th>
                <th>Expiration (Days)</th>
                <th onClick={() => handleSort("createdBy")}>
                  Created By{" "}
                  {sortBy === "createdBy"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "⇅"}
                </th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((item) => (
                  <tr key={item.appStatisticsID}>
                    <td>{item.storeName}</td>
                    <td>{item.subcriptionPlanName}</td>
                    <td className="text-right">
                      ${item.subcriptionPlanPrice.toLocaleString()}
                    </td>
                    <td>{item.subcriptionDescription}</td>
                    <td className="text-center">
                      {item.subcriptionTimeOfExpiration} days
                    </td>
                    <td>{item.createdBy}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <Pagination className="mt-3">
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </>
      )}
    </div>
  );
};

export default RevenueStatistics;