import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const DashboardContent = () => {
  return (
    <div className="p-4">
      <h2>Welcome to Admin Dashboard</h2>
      <Row className="mt-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Users</Card.Title>
              <Card.Text>100</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Products</Card.Title>
              <Card.Text>50</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Orders</Card.Title>
              <Card.Text>120</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Revenue</Card.Title>
              <Card.Text>$5000</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;
