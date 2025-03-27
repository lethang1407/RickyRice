import React from "react";
import { Modal, Image, Row, Col, Typography, Card } from "antd";
import DEFAULT_IMAGE_URL from "../../../assets/img/store_img_df.png";

const { Title, Text } = Typography;

const StoreDetailModal = ({ show, handleClose, store }) => {
  if (!store) return null;

  return (
    <Modal
      open={show}
      onCancel={handleClose}
      footer={null}
      centered
      title={<Title level={3}>Chi tiết cửa hàng</Title>}
      width={750}
    >
      <Row gutter={24} align="middle">
        <Col span={10} style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: 8,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ddd",
            }}
          >
            <Image
              src={store.image ? `${store.image}` : DEFAULT_IMAGE_URL}
              alt={store.storeName}
              fallback={DEFAULT_IMAGE_URL}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </Col>

        <Col span={14}>
          <Card bordered style={{ width: "100%", minHeight: "100%" }}>
            <Title level={3} style={{ marginBottom: 12 }}>
              {store.storeName}
            </Title>
            <Text style={{ fontSize: "16px" }}>
              <strong>Địa chỉ:</strong> {store.address}
            </Text>
            <br />
            <Text style={{ fontSize: "16px" }}>
              <strong>Liên hệ:</strong> {store.hotline}
            </Text>
            <br />
            <Text style={{ fontSize: "16px" }}>
              <strong>Mô tả:</strong> {store.description}
            </Text>
            <br />
            <Text style={{ fontSize: "16px" }}>
              <strong>Giờ hoạt động:</strong> {store.operatingHour}
            </Text>
            <br />
            <Text style={{ fontSize: "16px" }}>
              <strong>Chủ cửa hàng:</strong> {store.accountName}
            </Text>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default StoreDetailModal;
