import React, { useEffect, useState } from "react";
import API from "../../Utils/API/API.js";
import { getToken } from "../../Utils/UserInfoUtils";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Spin, Alert, Form, Upload } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
import avt_default from "../../assets/img/avt_default.jpg";
import UpdateProfile from "./UpdateProfile";

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

  const handleAvatarChange = async (file) => {
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
      <div className="mt-5">
        <Row justify="center" className="mt-5">
          <Col span={16}>
            <h2 className="mb-4">Thông tin tài khoản</h2>
            {message && <Alert message={message} type={messageType} />}
            {loading ? (
              <div className="text-center">
                <Spin size="large" />
              </div>
            ) : account ? (
              <Card className="p-4 shadow">
                <Row gutter={[16, 16]} align="middle">
                  <Col span={6} className="text-center">
                    <Space direction="vertical" size={20}>
                      <Space wrap size={20}>
                        <Avatar
                          size={100}
                          src={account.avatar || avt_default}
                          icon={!account.avatar && <UserOutlined />}
                        />
                      </Space>
                    </Space>

                    <Form>
                      <Form.Item>
                        <label className="btn btn-link">
                          {uploading ? "Đang tải lên..." : "Thay đổi ảnh"}
                          <Upload
                            accept="image/*"
                            showUploadList={false}
                            customRequest={({ file }) =>
                              handleAvatarChange(file)
                            }
                          ></Upload>
                        </label>
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col span={18}>
                    <Row>
                      <Col span={24}>
                        <p>
                          <strong>Tên đăng nhập:</strong> {account.username}
                        </p>
                      </Col>
                      <Col span={24}>
                        <p>
                          <strong>Họ Tên:</strong> {account.name}
                        </p>
                      </Col>
                      <Col span={24}>
                        <p>
                          <strong>Email:</strong> {account.email}
                        </p>
                      </Col>
                      <Col span={24}>
                        <p>
                          <strong>Số điện thoại:</strong> {account.phoneNumber}
                        </p>
                      </Col>
                      <Col span={24}>
                        <p>
                          <strong>Giới tính:</strong>{" "}
                          {account.gender ? "Nam" : "Nữ"}
                        </p>
                      </Col>
                      <Col span={24}>
                        <p>
                          <strong>Ngày sinh:</strong> {account.birthDate}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row justify="space-between" gutter={[8, 8]}>
                  <Col>
                    <Button onClick={() => navigate(-1)} type="default">
                      Quay lại
                    </Button>
                  </Col>
                  <Col style={{ textAlign: "right" }}>
                    <Button
                      type="primary"
                      onClick={() => setShowUpdate(true)}
                      style={{ marginRight: 8 }}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      type="warning"
                      onClick={() => navigate("/account-change-password")}
                    >
                      Thay đổi mật khẩu
                    </Button>
                  </Col>
                </Row>
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
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AccountInfo;
