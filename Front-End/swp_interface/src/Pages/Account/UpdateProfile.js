import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, DatePicker, message } from "antd";
import API from "../../Utils/API/API.js";
import { getToken } from "../../Utils/UserInfoUtils";
import moment from "moment";
import { error } from "../../Utils/AntdNotification/index.js";
import axios from "axios";

const { Option } = Select;

const UpdateProfile = ({
  show,
  handleClose,
  account,
  onUpdateSuccess,
  onUpdateFail,
}) => {
  const [formData, setFormData] = useState({
    name: account.name || "",
    phoneNumber: account.phoneNumber || "",
    gender: account.gender ?? null,
    birthDate: account.birthDate || "",
  });
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const [messageApi, contextHolder] = message.useMessage();

  const handleChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm validate số điện thoại
  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^0\d{9}$/; // Kiểm tra số điện thoại có 10 chữ số và bắt đầu bằng 0
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async () => {
    // Kiểm tra validate số điện thoại
    if (!validatePhoneNumber(formData.phoneNumber)) {
      message.error("Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại đúng.");
      return;
    }

    setLoading(true);
  
    try {
      const response = await axios.patch(API.ACCOUNT.UPDATE_ACCOUNT, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.code === 200) {
        message.success("Cập nhật thành công!");
        onUpdateSuccess(response.data.data);
      } else {
        message.error("Cập nhật thất bại!");
        onUpdateFail("Cập nhật thất bại!");
      }
    } catch (err) {
      error(err.response?.data?.message || "Có lỗi xảy ra", messageApi);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {contextHolder}
    <Modal
      title="Cập nhật thông tin"
      visible={show}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Họ tên">
          <Input
            value={formData.name}
            onChange={(e) => handleChange(e.target.value, "name")}
          />
        </Form.Item>

        <Form.Item label="Số điện thoại">
          <Input
            value={formData.phoneNumber}
            onChange={(e) => handleChange(e.target.value, "phoneNumber")}
          />
        </Form.Item>

        <Form.Item label="Giới tính">
          <Select
            value={formData.gender ?? ""}
            onChange={(value) => handleChange(value, "gender")}
            placeholder="Chưa xác định"
          >
            <Option value="true">Nam</Option>
            <Option value="false">Nữ</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Ngày sinh">
          <DatePicker
            value={formData.birthDate ? moment(formData.birthDate) : null}
            onChange={(date, dateString) => handleChange(dateString, "birthDate")}
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <div className="d-flex justify-content-end">
          <Button onClick={handleClose} className="me-2">
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </Form>
    </Modal>
    </>
  );
};

export default UpdateProfile;
