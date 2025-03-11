import React, { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { getToken } from "../../Utils/UserInfoUtils";
import API from "../../Utils/API/API.js";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  const token = getToken();

  // Hàm kiểm tra định dạng của mật khẩu mới
  const validateNewPassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Mật khẩu phải có ít nhất 8 ký tự.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một chữ cái in hoa.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một chữ cái thường.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một chữ số.");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*).");
    }
    return errors;
  };

  // Hàm kiểm tra các trường trước khi gửi
  const validateFields = () => {
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
    // Kiểm tra định dạng mật khẩu mới
    const newPasswordErrors = validateNewPassword(newPassword);
    errors = errors.concat(newPasswordErrors);
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường nhập liệu
    const errors = validateFields();
    if (errors.length > 0) {
      setMessage(errors.join(" "));
      setMessageType("danger");
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
        setMessage(
          data.message || "Cập nhật mật khẩu thất bại. Vui lòng nhập lại."
        );
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
      setMessageType("danger");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Thay đổi mật khẩu</h2>
      {message && <Alert variant={messageType}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="oldPassword">
          <Form.Label>Mật khẩu hiện tại</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập mật khẩu hiện tại"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="newPassword">
          <Form.Label>Mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Xác nhận mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Thay đổi mật khẩu"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default ChangePassword;
