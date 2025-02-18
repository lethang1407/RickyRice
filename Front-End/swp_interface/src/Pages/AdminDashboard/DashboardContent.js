import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import RevenueStatistics from "./RevenueStatistics";
import API from "../../Utils/API/API.js";
import { getToken } from "../../Utils/UserInfoUtils";

const DashboardContent = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);

  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    const fetchTotalAccounts = async () => {
      try {
        const response = await axios.get(API.ADMIN.GET_ALL_ACCOUNT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.code === 200) {
          setTotalAccounts(response.data.data.length);
        }
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    fetchTotalAccounts();
  }, []);

  useEffect(() => {
    const fetchTotalStores = async () => {
      try {
        const response = await axios.get(API.ADMIN.VIEW_ALL_STORE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.code === 200) {
          setTotalStores(response.data.data.length);
        }
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    fetchTotalStores();
  }, []);

  useEffect(() => {
    const fetchTotalSubscriptions = async () => {
      try {
        const response = await axios.get(API.ADMIN.VIEW_ALL_SUBSCRIPTION_PLAN, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.code === 200) {
          setTotalSubscriptions(response.data.data.length);
        }
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    fetchTotalSubscriptions();
  }, []);

  return (
    <div className="p-4">
      <h2>Welcome to Admin Dashboard</h2>
      <br />
      <Row className="mt-4">
        <Col md={3}>
          <Card className="text-center bg-success text-white">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <Card.Text>${totalRevenue.toLocaleString()}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="text-center bg-primary text-white"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/account_owner")}
          >
            <Card.Body>
              <Card.Title>Total Store Owners</Card.Title>
              <Card.Text>{totalAccounts}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="text-center bg-warning text-white"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/view_stores")}
          >
            <Card.Body>
              <Card.Title>Total Stores</Card.Title>
              <Card.Text>{totalStores}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="text-center bg-info text-white"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/subscription_plans")}
          >
            <Card.Body>
              <Card.Title>Total Subscription Service</Card.Title>
              <Card.Text>{totalSubscriptions}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <RevenueStatistics setTotalRevenue={setTotalRevenue} />
    </div>
  );
};

export default DashboardContent;
