import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { getToken } from "../../Utils/UserInfoUtils";
import API from "../../Utils/API/API.js";
import HomeHeader from "../../Components/HomeHeader";
import "./style.css";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const token = getToken();

  useEffect(() => {
    fetch(API.PUBLIC.SUBSCRIPTION_PLAN)
      .then((res) => res.json())
      .then((data) => setPlans(data.data))
      .catch((err) => console.error("Error fetching plans:", err));
  }, []);

  const handlePayment = async (plan) => {
    if (!token) {
      alert("Bạn cần đăng nhập để thanh toán!");
      window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
      return;
    }

    try {
      const response = await fetch(
        API.VNPAY.CREATE_PAYMENT(plan.price, plan.subscriptionPlanID),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 403) {
        alert("Vui lòng sử dụng tài khoản chủ cửa hàng để sử dụng dịch vụ.");
        return;
      }

      const data = await response.json();
      if (data.data) {
        window.location.href = data.data;
      } else {
        alert("Fail create payment VNPay request!");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <>
      <div className="subscription-plans-header">
        <HomeHeader />
      </div>

      <Container className="subscription-plans-container">
        <h2 className="text-center mb-4">Chọn Gói Đăng Ký</h2>
        <Row className="justify-content-center align-items-center w-100">
          {plans.map((plan) => (
            <Col
              md={4}
              key={plan.subscriptionPlanID}
              className="d-flex justify-content-center"
            >
              <Card className="subscription-card shadow-sm w-100">
                <Card.Body>
                  <Card.Title>{plan.name}</Card.Title>
                  <Card.Text>{plan.description}</Card.Text>
                  <h5>{plan.price.toLocaleString()} VND</h5>
                  <p>Thời hạn: {plan.timeOfExpiration} tháng</p>
                  <Button variant="primary" onClick={() => handlePayment(plan)}>
                    Thanh toán
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SubscriptionPlans;
