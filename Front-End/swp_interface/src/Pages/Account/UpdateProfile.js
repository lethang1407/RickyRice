import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import API from "../../Utils/API/API.js";
import { getToken } from "../../Utils/UserInfoUtils";

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
  const [, setMessage] = useState(null);
  const [, setMessageType] = useState("success");
  const token = getToken();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(API.ACCOUNT.UPDATE_ACCOUNT, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          setMessage("Cập nhật thành công!");
          setMessageType("success");
          onUpdateSuccess(data.data);
        } else {
          setMessage("Cập nhật thất bại!");
          setMessageType("danger");
          onUpdateFail("Cập nhật thất bại!");
        }
      })
      .catch(() => {
        setMessage("Có lỗi xảy ra, vui lòng thử lại!");
        setMessageType("danger");
        onUpdateFail("Có lỗi xảy ra, vui lòng thử lại!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật thông tin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Giới tính</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender ?? ""}
              onChange={handleChange}
            >
              <option value="">Chưa xác định</option>
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày sinh</Form.Label>
            <Form.Control
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProfile;
