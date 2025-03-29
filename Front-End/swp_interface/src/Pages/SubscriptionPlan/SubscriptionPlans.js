import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getToken } from "../../Utils/UserInfoUtils";
import API from "../../Utils/API/API.js";
import HomeHeader from "../../Components/HomeHeader";
import "./style.css";
import { Card, Col, Row, Button } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import background from "../../assets/img/ricebackgr.png";

const SubscriptionPlans = () => {
  const { storeID } = useParams(); // Lấy storeID nếu có
  const [plans, setPlans] = useState([]);
  const token = getToken();

  useEffect(() => {
    axios
      .get(API.PUBLIC.SUBSCRIPTION_PLAN)
      .then((res) => setPlans(res.data.data))
      .catch((err) => console.error("Error fetching plans:", err));
  }, []);

  const handlePayment = async (plan) => {
    if (!token) {
      alert("Bạn cần đăng nhập để thanh toán!");
      window.location.href = "/login";
      return;
    }

    try {
      // Kiểm tra nếu storeID tồn tại thì thêm vào API
      const paymentUrl = storeID
        ? API.VNPAY.CREATE_PAYMENT(plan.price, plan.subscriptionPlanID) +
          `&storeID=${storeID}`
        : API.VNPAY.CREATE_PAYMENT(plan.price, plan.subscriptionPlanID);

      const response = await axios.get(paymentUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        alert("Vui lòng sử dụng tài khoản chủ cửa hàng để sử dụng dịch vụ.");
        return;
      }

      if (response.data.data) {
        window.location.href = response.data.data;
      } else {
        alert("Fail create payment VNPay request!");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div
      className="subscription-plans-wrapper"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="subscription-plans-header">
        <HomeHeader />
      </div>

      <Container className="subscription-plans-container">
        {/* <h2 className="text-center mb-4">Chọn Gói Đăng Ký</h2> */}
        <Row gutter={[16, 16]} justify="center">
          {plans.map((plan) => (
            <Col span={8} key={plan.subscriptionPlanID}>
              <Card
                title={plan.name}
                bordered={false}
                className="subscription-card"
              >
                <p>{plan.description}</p>
                <h5>{plan.price.toLocaleString()} VND</h5>
                <p>Thời hạn: {plan.timeOfExpiration} tháng</p>
                <Button type="primary" onClick={() => handlePayment(plan)}>
                  Thanh toán
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default SubscriptionPlans;
