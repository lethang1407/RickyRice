import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
  Pagination,
} from "react-bootstrap";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StoreDetailModal from "./StoreDetailModal";
import "./style.css";

const AdminViewStores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9999/admin/view_store"
        );
        if (response.data.code === 200) {
          setStores(response.data.data);
          setFilteredStores(response.data.data);
        } else {
          setError("Failed to fetch store data");
        }
      } catch (err) {
        setError("Error fetching store data");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    let filteredData = stores.filter(
      (store) =>
        store.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.accountName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (subscriptionFilter !== "All") {
      filteredData = filteredData.filter(
        (store) => store.subscriptionPlanName === subscriptionFilter
      );
    }

    setFilteredStores(filteredData);
    setCurrentPage(1);
  }, [searchQuery, subscriptionFilter, stores]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...filteredStores].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredStores(sortedData);
    setSortConfig({ key, direction });
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredStores.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredStores.length / recordsPerPage);

  const getPaginationItems = () => {
    return [...Array(totalPages)].map((_, index) => (
      <Pagination.Item
        key={index + 1}
        active={index + 1 === currentPage}
        onClick={() => setCurrentPage(index + 1)}
      >
        {index + 1}
      </Pagination.Item>
    ));
  };
  // Hàm hiển thị biểu tượng sắp xếp
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "⇅";
  };

  return (
    <div>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Container className="mt-4">
          <h2 className="mb-4 text-center">Stores List</h2>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by Store Name or Account Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Select
                value={subscriptionFilter}
                onChange={(e) => setSubscriptionFilter(e.target.value)}
              >
                <option value="All">All Subscription Plans</option>
                {[
                  ...new Set(stores.map((store) => store.subscriptionPlanName)),
                ].map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th onClick={() => handleSort("storeName")}>
                      Store Name {getSortIcon("storeName")}
                    </th>
                    <th onClick={() => handleSort("expireAt")}>
                      Expire At {getSortIcon("expireAt")}
                    </th>
                    <th onClick={() => handleSort("accountName")}>
                      Account Name {getSortIcon("accountName")}
                    </th>
                    <th onClick={() => handleSort("subscriptionPlanName")}>
                      Subscription Plan {getSortIcon("subscriptionPlanName")}
                    </th>
                    <th onClick={() => handleSort("createdAt")}>
                      Created At {getSortIcon("createdAt")}
                    </th>
                    <th onClick={() => handleSort("updateAt")}>
                      Updated At {getSortIcon("updateAt")}
                    </th>
                    <th>Price ($)</th>
                    <th>Subscription (Months)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((store, index) => (
                    <tr
                      key={store.storeID}
                      onClick={() =>
                        setShowModal(true) || setSelectedStore(store)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td>{index + 1 + indexOfFirstRecord}</td>
                      <td>{store.storeName}</td>
                      <td>{store.expireAt || "N/A"}</td>
                      <td>{store.accountName}</td>
                      <td>{store.subscriptionPlanName}</td>
                      <td>{new Date(store.createdAt).toLocaleDateString()}</td>
                      <td>
                        {store.updateAt
                          ? new Date(store.updateAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>{store.subscriptionPlanPrice}</td>
                      <td>{store.subscriptionTimeOfExpiration}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="mt-3">
                <Pagination.Prev
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                />
                {getPaginationItems()}
                <Pagination.Next
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </>
          )}
        </Container>
      </div>
      <StoreDetailModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        store={selectedStore}
      />
    </div>
  );
};

export default AdminViewStores;
