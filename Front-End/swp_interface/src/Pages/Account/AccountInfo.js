import React, { useEffect, useState } from "react";
import API from "../../Utils/API/API.js";
import { getToken } from "../../Utils/UserInfoUtils";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert, Form } from "react-bootstrap";
import avt_default from "../../assets/img/avt_default.jpg";
import UpdateProfile from "./UpdateProfile";
import Navbar from "./NavbarAccount.js";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";

const AccountInfo = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [uploading, setUploading] = useState(false);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API.ACCOUNT.GET_INFOR_ACCOUNT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setAccount(data.data);
        }
      })
      .catch((error) => console.error("Error fetching account info:", error))
      .finally(() => setLoading(false));
  }, [token]);

  const handleUpdateSuccess = (updatedAccount) => {
    setAccount(updatedAccount);
    setShowUpdate(false);
    setMessage("Cập nhật thông tin thành công!");
    setMessageType("success");
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdateFail = (errorMessage) => {
    setMessage(errorMessage || "Cập nhật thất bại!");
    setMessageType("danger");
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(API.PUBLIC.UPLOAD_IMG, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.code === 200) {
        const newAvatarUrl = data.data;
        const updateResponse = await fetch(API.ACCOUNT.UPDATE_ACCOUNT, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: newAvatarUrl }),
        });

        const updateData = await updateResponse.json();
        if (updateData.code === 200) {
          setAccount(updateData.data);
          setMessage("Cập nhật ảnh đại diện thành công!");
          setMessageType("success");
        } else {
          throw new Error("Cập nhật thất bại!");
        }
      } else {
        throw new Error("Tải ảnh lên thất bại!");
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("danger");
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <>
      {/* <div className="mt-5">
        <Navbar />
      </div> */}
      <Container className="mt-5">
        <h2 className="mb-4">Thông tin tài khoản</h2>
        {message && <Alert variant={messageType}>{message}</Alert>}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : account ? (
          <Card className="p-4 shadow">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-center">
                <Space direction="vertical" size={20}>
                  <Space wrap size={20}>
                    <Avatar
                      size={64}
                      src={account.avatar || avt_default}
                      icon={!account.avatar && <UserOutlined />}
                    />
                  </Space>
                </Space>
                
                <Form.Group>
                  <Form.Label className="btn btn-link">
                    {uploading ? "Đang tải lên..." : "Thay đổi ảnh"}
                    <Form.Control
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAvatarChange}
                    />
                  </Form.Label>
                </Form.Group>
              </div>
              <div className="d-flex">
                <Button variant="primary" onClick={() => setShowUpdate(true)}>
                  Chỉnh sửa
                </Button>
                <Button
                  variant="warning"
                  className="ms-2"
                  onClick={() => navigate("/account-change-password")}
                >
                  Thay đổi mật khẩu
                </Button>
              </div>
            </div>
            <Card.Body>
              <p>
                <strong>Tên đăng nhập:</strong> {account.username}
              </p>
              <p>
                <strong>Họ Tên:</strong> {account.name}
              </p>
              <p>
                <strong>Email:</strong> {account.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {account.phoneNumber}
              </p>
              <p>
                <strong>Giới tính:</strong> {account.gender ? "Nam" : "Nữ"}
              </p>
              <p>
                <strong>Ngày sinh:</strong> {account.birthDate}
              </p>
            </Card.Body>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </Card>
        ) : (
          <p className="text-danger">Không thể tải thông tin tài khoản</p>
        )}

        {account && (
          <UpdateProfile
            show={showUpdate}
            handleClose={() => setShowUpdate(false)}
            account={account}
            onUpdateSuccess={handleUpdateSuccess}
            onUpdateFail={handleUpdateFail}
          />
        )}
      </Container>
    </>
  );
};

export default AccountInfo;
