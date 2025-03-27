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
  // Hàm validate giá trị "Giá"
  const validatePrice = (rule, value) => {
    if (!value || value <= 0) {
      return Promise.reject("Giá tiền phải lớn hơn 0!");
    }
    if (value % 1000 !== 0) {
      return Promise.reject("Giá tiền phải là số chẵn chia hết cho 1000!");
    }
    return Promise.resolve();
  };

  // Hàm validate "Thời gian hết hạn"
  const validateTimeOfExpiration = (rule, value) => {
    const numValue = Number(value); // Chuyển giá trị thành số
    if (!numValue || numValue <= 0 || !Number.isInteger(numValue)) {
      return Promise.reject("Thời gian hết hạn phải là số nguyên lớn hơn 0!");
    }
    return Promise.resolve();
  };

  // Hàm validate "Trạng thái"
  const validateStatus = (rule, value) => {
    if (value === undefined) {
      return Promise.reject("Vui lòng chọn trạng thái!");
    }
    return Promise.resolve();
  };

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
        <Form.Item name="description" label="Mô tả" rules={[
            { required: true, message: "Vui lòng nhập mô tả!" },
          ]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="price"
          label="Giá (VNĐ)"
          rules={[
            { required: true, message: "Vui lòng nhập giá!" },
            { validator: validatePrice },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="timeOfExpiration"
          label="Thời hạn (tháng)"
          rules={[
            { required: true, message: "Vui lòng nhập thời hạn!" },
            { validator: validateTimeOfExpiration },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="isActive"
          label="Trạng thái"
          rules={[
            { required: true, message: "Vui lòng chọn trạng thái!" },
            { validator: validateStatus },
          ]}
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
