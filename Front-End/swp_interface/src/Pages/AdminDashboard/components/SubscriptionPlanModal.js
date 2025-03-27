import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

const SubscriptionPlanModal = ({
  visible,
  onCancel,
  onFinish,
  form,
  title,
  initialValues,
}) => {
  return (
    <Modal title={title} open={visible} onCancel={onCancel} footer={null}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Tên gói"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="price"
          label="Giá"
          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="timeOfExpiration"
          label="Thời gian hết hạn (tháng)"
          rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="isActive"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Option value={false}>Ẩn</Option>
            <Option value={true}>Hiển thị</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {title.includes("Tạo") ? "Tạo" : "Cập nhật"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubscriptionPlanModal;
