import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from "antd";
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

  // Gọi API lấy tổng doanh thu
  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await axios.get(API.ADMIN.VIEW_REVENUE_STATISTICS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.code === 200) {
          setTotalRevenue(response.data.data.totalRevenue); // Cập nhật tổng doanh thu
        }
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    fetchTotalRevenue();
  }, [token]);

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
  }, [token]);

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
  }, [token]);

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
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            title="Doanh thu"
            style={{
              backgroundColor: "grey",
              color: "white",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {totalRevenue.toLocaleString()} VND
            </p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            title="Tài khoản chủ cửa hàng"
            hoverable
            style={{
              backgroundColor: "grey",
              color: "white",
              textAlign: "center",
            }}
            onClick={() => navigate("/admin/account_owner")}
          >
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {totalAccounts}
            </p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            title="Cửa hàng"
            hoverable
            style={{
              backgroundColor: "grey",
              color: "white",
              textAlign: "center",
            }}
            onClick={() => navigate("/admin/view_stores")}
          >
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {totalStores}
            </p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            title="Dịch vụ đăng ký"
            hoverable
            style={{
              backgroundColor: "grey",
              color: "white",
              textAlign: "center",
            }}
            onClick={() => navigate("/admin/subscription_plans")}
          >
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {totalSubscriptions}
            </p>
          </Card>
        </Col>
      </Row>
      {/* Thống kê doanh thu */}
      <RevenueStatistics setTotalRevenue={setTotalRevenue} />
    </div>
  );
};

export default DashboardContent;
