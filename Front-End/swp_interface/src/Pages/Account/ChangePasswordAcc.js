import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Row, Col } from "antd";
import { getToken } from "../../Utils/UserInfoUtils";
import API from "../../Utils/API/API.js";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = getToken();

  const validateNewPassword = (password) => {
    const errors = [];

    if (password.length < 6) {
      errors.push("Mật khẩu phải có ít nhất 6 ký tự.");
    }

    if (!/[A-Za-z]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một chữ cái.");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một chữ số.");
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Mật khẩu không được chứa ký tự đặc biệt.");
    }
    return errors;
  };

  const validateFields = (oldPassword, newPassword, confirmPassword) => {
    let errors = [];
    if (!oldPassword) {
      errors.push("Mật khẩu hiện tại không được để trống.");
    }
    if (!newPassword) {
      errors.push("Mật khẩu mới không được để trống.");
    }
    if (!confirmPassword) {
      errors.push("Xác nhận mật khẩu không được để trống.");
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.push("Mật khẩu mới và xác nhận mật khẩu không khớp.");
    }
    errors = errors.concat(validateNewPassword(newPassword));
    return errors;
  };

  const handleSubmit = async (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    const errors = validateFields(oldPassword, newPassword, confirmPassword);
    if (errors.length > 0) {
      setMessage(errors.join(" "));
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API.ACCOUNT.CHANGE_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok && data.code === 200) {
        setMessage("Thay đổi mật khẩu thành công");
        setMessageType("success");
      } else {
        setMessage(data.message || "Cập nhật mật khẩu thất bại.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
      setMessageType("error");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <Row justify="center" className="mt-5">
      <Col xs={24} sm={22} md={16} lg={12} xl={10}>
        <h2 className="mb-4">Thay đổi mật khẩu</h2>
        {message && <Alert message={message} type={messageType} />}
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Mật khẩu hiện tại"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Mật khẩu hiện tại không được để trống.",
              },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu hiện tại"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Mật khẩu mới không được để trống." },
              () => ({
                validator(_, value) {
                  const errors = validateNewPassword(value);
                  if (errors.length > 0) {
                    return Promise.reject(new Error(errors.join(" ")));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Xác nhận mật khẩu không được để trống.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && value !== getFieldValue("newPassword")) {
                    return Promise.reject(
                      new Error("Mật khẩu mới và xác nhận mật khẩu không khớp.")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thay đổi mật khẩu
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default ChangePassword;
