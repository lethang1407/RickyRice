import React, { useState, useEffect } from "react";
import { Modal, Spin, Button, message, Image } from "antd";
import {
    UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined,
    CalendarOutlined, ManOutlined, WomanOutlined
} from '@ant-design/icons';
import './style.scss'; 
import { error, success } from '../../../Utils/AntdNotification';
import axios from "axios";
import API from "../../../Utils/API/API";
import { getToken } from "../../../Utils/UserInfoUtils";
import { getDataWithToken } from "../../../Utils/FetchUtils";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import user from '../../../assets/img/user_default.png';

const deleteDataWithToken = async (url, token) => {
    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 || response.status === 204) {
            return { success: true, message: "Xóa thành công" };
        } else {
            return { success: false, message: response.data?.message || "Lỗi khi xóa" };
        }
    } catch (err) {
        console.error("Lỗi khi xóa (API):", err);
        let errorMessage = "Xóa thất bại";
        if (err.response) {
            errorMessage = `Lỗi từ server: ${err.response.status} - ${err.response.data?.message || 'Không có thông báo chi tiết'}`;
        } else if (err.request) {
            errorMessage = "Không thể kết nối đến server";
        } else {
            errorMessage = err.message || "Đã xảy ra lỗi không xác định";
        }

        throw new Error(errorMessage);
    }
};
const EmployeeDetailModal = ({ visible, employeeID, onClose, onEmployeeDeleted }) => {
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const token = getToken();
    const [employee, setEmployee] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployeeDetail = async () => {
            if (visible && employeeID) {
                setLoading(true);
                try {
                    const response = await getDataWithToken(
                        `${API.STORE_OWNER.GET_STORE_EMPLOYEE_DETAIL}?id=${employeeID}`,
                        token
                    );
                    setEmployee(response);
                } catch (err) {
                    error("Không thể tải chi tiết nhân viên", messageApi);
                    setEmployee(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (visible && employeeID) {
            fetchEmployeeDetail();
        }

        if (!visible) {
            setEmployee(null);
        }
    }, [visible, employeeID, token, messageApi]);

    const handleEdit = () => {
        navigate('/store-owner/employee/update', { state: { employeeID, storeId: employee?.storeInfo?.storeID } });
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const response = await deleteDataWithToken(
                `${API.STORE_OWNER.DELETE_STORE_EMPLOYEE}/${employeeID}`,
                token
            );

            if (response.success) {
                success(response.message, messageApi);
                onClose();
                onEmployeeDeleted();
            } else {
                error(response.message || "Xóa nhân viên thất bại", messageApi);
            }
        } catch (err) {
            error(err.message || "Xóa nhân viên thất bại", messageApi);
        } finally {
            setLoading(false);
            setShowConfirmModal(false);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false);
    };

    const openConfirmModal = () => {
        setShowConfirmModal(true);
    };

    return (
        <Modal
            className="employee-modal"  
            title={<div className="modal-title">Chi tiết nhân viên</div>}
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="edit" type="primary" onClick={handleEdit}>
                    Chỉnh sửa
                </Button>,
                <Button key="delete" danger onClick={openConfirmModal}>
                    Xóa
                </Button>,
            ]}
            width={600}
        >
            {contextHolder}
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : employee ? (
                <div className="employee-container">
                    <div className="avatar-info-wrapper">
                        <Image
                            className="avatar-image"
                            width={100}
                            height={100}
                            src={employee.storeAccount.avatar || user}
                            alt="Avatar"
                            fallback={user}
                            preview={{
                                mask: <span>Xem ảnh lớn</span>,
                                maskClassName: "custom-preview-mask",
                                scaleStep: 1,
                                maxScale: 10,
                            }}
                        />
                        <div className="info-wrapper">
                            <div className="info-title">
                                <h2>Thông tin nhân viên</h2>
                            </div>
                            <div className="info-row">
                                <UserOutlined className="info-icon" />
                                <strong className="info-label">Họ và tên:</strong>
                                <span>{employee.storeAccount.name ?? 'N/A'}</span>
                            </div>
                            <div className="info-row">
                                <MailOutlined className="info-icon" />
                                <strong className="info-label">Email:</strong>
                                <span>{employee.storeAccount.email ?? 'N/A'}</span>
                            </div>
                            <div className="info-row">
                                <PhoneOutlined className="info-icon" />
                                <strong className="info-label">Số điện thoại:</strong>
                                <span>{employee.storeAccount.phoneNumber ?? 'N/A'}</span>
                            </div>
                            <div className="info-row">
                                {employee.storeAccount.gender ? <ManOutlined className="info-icon" /> : <WomanOutlined className="info-icon" />}
                                <strong className="info-label">Giới tính:</strong>
                                <span>{employee.storeAccount.gender ? "Nam" : "Nữ"}</span>
                            </div>
                            <div className="info-row">
                                <CalendarOutlined className="info-icon" />
                                <strong className="info-label">Ngày sinh:</strong>
                                <span>
                                    {employee.storeAccount.birthDate
                                        ? moment(employee.storeAccount.birthDate).format('DD/MM/YYYY')
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className="info-row">
                                <EnvironmentOutlined className="info-icon" />
                                <strong className="info-label">Cửa hàng:</strong>
                                <span>{employee.storeInfo.storeName ?? 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <Modal
                        className="confirm-modal"
                        title={<div className="confirm-title">Xác nhận xóa</div>}
                        visible={showConfirmModal}
                        onOk={handleDelete}
                        onCancel={handleCancelDelete}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true, loading: loading }}
                        centered
                    >
                        <p>Bạn có chắc chắn muốn xóa nhân viên "{employee?.storeAccount?.name ?? 'N/A'}" không?  Hành động này không thể hoàn tác.</p>
                    </Modal>
                </div>
            ) : (
                <p style={{ textAlign: "center" }}>Không tìm thấy nhân viên</p>
            )}
        </Modal>
    );
};

export default EmployeeDetailModal;