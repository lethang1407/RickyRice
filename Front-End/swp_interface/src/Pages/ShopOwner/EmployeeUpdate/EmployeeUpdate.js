import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Card, Input, Button, Form, DatePicker, Radio, Upload, Modal, message, Avatar } from "antd";
import { UserOutlined, PlusOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import API from "../../../Utils/API/API";
import { getToken } from "../../../Utils/UserInfoUtils";
import { getDataWithToken } from "../../../Utils/FetchUtils";
import "./style.scss";
import { success, error } from '../../../Utils/AntdNotification';
import moment from 'moment';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

const uploadAvatarAPI = async (url, token, file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.put(url, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data) {
            if (typeof response.data === 'string' && response.data.startsWith('http')) {
                return response.data;
            }
            if (typeof response.data === 'object' && response.data.url) {
                return response.data.url;
            }
            if (typeof response.data === 'object' && response.data.link) {
                return response.data.link;
            }
            console.warn("Unexpected avatar upload response format:", response.data);
            throw new Error("Tải ảnh đại diện lên thất bại: Định dạng phản hồi không mong đợi.");
        } else {
            throw new Error("Tải ảnh đại diện lên thất bại: Không có dữ liệu trả về.");
        }
    } catch (err) {
        console.error("Lỗi khi tải ảnh đại diện lên (API):", err);
        const errorMsg = err.response?.data?.message || err.message || "Tải ảnh đại diện lên thất bại.";
        if (errorMsg.toLowerCase().includes("invalid file") || errorMsg.toLowerCase().includes("unsupported image type")) {
            throw new Error("Tải ảnh đại diện lên thất bại: Định dạng file không hợp lệ hoặc không được hỗ trợ.");
        }
        throw new Error(errorMsg);
    }
};

const updateEmployeeAPI = async (url, token, employee) => {
    try {
        const response = await axios.put(url, employee, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.data && response.data.success === false) {
            throw new Error(response.data.message || "Cập nhật nhân viên thất bại từ server.");
        }
        return response.data;
    } catch (err) {
        console.error("Lỗi khi cập nhật nhân viên (API):", err);
        throw new Error(err.response?.data?.message || err.message || "Cập nhật nhân viên thất bại.");
    }
};

const EmployeeUpdate = () => {
    const location = useLocation();
    const { employeeID } = location.state || {};
    const navigate = useNavigate();
    const token = getToken();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const UPLOAD_AVATAR_URL = `${API.STORE_OWNER.UPLOAD_EMPLOYEE_AVATAR}`;
    const UPDATE_EMPLOYEE_URL = `${API.STORE_OWNER.UPDATE_STORE_EMPLOYEE}/${employeeID}`;
    const GET_EMPLOYEE_DETAIL_URL = `${API.STORE_OWNER.GET_STORE_EMPLOYEE_DETAIL}?id=${employeeID}`;

    useEffect(() => {
        const fetchData = async () => {
            if (!employeeID) {
                error("Không tìm thấy ID nhân viên.", messageApi);
                navigate("/store-owner/employee");
                return;
            }
            setLoading(true);
            try {
                const response = await getDataWithToken(GET_EMPLOYEE_DETAIL_URL, token);

                if (!response || !response.storeAccount) {
                    throw new Error("Dữ liệu nhân viên không hợp lệ trả về từ API.");
                }

                const { storeAccount, storeInfo } = response;

                const initialFileList = storeAccount.avatar
                    ? [{ uid: '-1', name: 'avatar.png', status: 'done', url: storeAccount.avatar }]
                    : [];
                setFileList(initialFileList);

                form.setFieldsValue({
                    name: storeAccount.name,
                    username: storeAccount.username,
                    email: storeAccount.email,
                    phoneNumber: storeAccount.phoneNumber,
                    gender: storeAccount.gender,
                    birthDate: storeAccount.birthDate ? moment(storeAccount.birthDate) : null,
                    storeName: storeInfo?.storeName,
                    storeID: storeInfo?.storeID,
                });

            } catch (err) {
                console.error("Error fetching employee details:", err);
                error(err.message || "Không thể tải chi tiết nhân viên", messageApi);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [employeeID, token, navigate, form, messageApi, GET_EMPLOYEE_DETAIL_URL]);


    const handleUpdate = async (values) => {
        setIsSubmitting(true);
        let avatarUrl = null;

        try {
            if (fileList.length > 0 && fileList[0].originFileObj) {
                messageApi.open({ type: 'loading', content: 'Đang tải ảnh đại diện...', duration: 0 });
                try {
                    avatarUrl = await uploadAvatarAPI(UPLOAD_AVATAR_URL, token, fileList[0].originFileObj);
                    messageApi.destroy();
                    if (!avatarUrl || typeof avatarUrl !== 'string') {
                        throw new Error("URL ảnh đại diện không hợp lệ trả về.");
                    }
                } catch (uploadError) {
                    messageApi.destroy();
                    error(`Lỗi tải ảnh: ${uploadError.message}`, messageApi);
                    setIsSubmitting(false);
                    return;
                }
            } else if (fileList.length > 0 && fileList[0].url) {
                avatarUrl = fileList[0].url;
            } else {
                avatarUrl = "";
            }

            const employeeUpdatePayload = {
                employeeID: employeeID,
                storeAccount: {
                    name: values.name,
                    username: values.username,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    gender: values.gender,
                    birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
                    avatar: avatarUrl,
                    ...(values.password && { password: values.password }),
                },
            };

            messageApi.open({ type: 'loading', content: 'Đang cập nhật thông tin nhân viên...', duration: 0 });
            await updateEmployeeAPI(UPDATE_EMPLOYEE_URL, token, employeeUpdatePayload);
            messageApi.destroy();
            success('Cập nhật nhân viên thành công!', messageApi);
            setTimeout(() =>
                navigate("/store-owner/employee"),
                1000
            );
        } catch (err) {
            messageApi.destroy();
            console.error("Update failed:", err);
            error(err.message || "Cập nhật nhân viên thất bại", messageApi);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            try {
                file.preview = await getBase64(file.originFileObj);
            } catch (e) {
                messageApi.error("Không thể xem trước file!");
                return;
            }
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleAvatarChange = ({ file, fileList: newFileList }) => {
        if (file.originFileObj && file.status !== 'error' && file.status !== 'uploading') {
            getBase64(file.originFileObj)
                .then(base64 => {
                    setFileList([{
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        originFileObj: file.originFileObj,
                        url: base64
                    }]);
                })
                .catch(() => {
                    messageApi.error('Không thể đọc file ảnh.');
                    setFileList([]);
                });
        } else if (file.status === 'removed') {
            setFileList([]);
        }
    };


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
        </div>
    );

    return (
        <div className="update-employee-container">
            {contextHolder}
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : (
                <Card title="Cập nhật thông tin nhân viên" className="update-employee-card">
                    <Form form={form} layout="vertical" onFinish={handleUpdate} className="update-employee-form">
                        <Form.Item
                            label="Ảnh đại diện"
                            className="avatar-uploader-item"
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                fileList={fileList}
                                beforeUpload={(file) => {
                                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                                    if (!isJpgOrPng) {
                                        messageApi.error('Bạn chỉ có thể tải lên file JPG/PNG!');
                                    }
                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                    if (!isLt2M) {
                                        messageApi.error('Ảnh phải nhỏ hơn 2MB!');
                                    }
                                    return isJpgOrPng && isLt2M ? false : Upload.LIST_IGNORE;
                                }}
                                onPreview={handlePreview}
                                onChange={handleAvatarChange}
                                maxCount={1}
                            >
                                {fileList.length < 1 && uploadButton}
                            </Upload>
                        </Form.Item>

                        <div className="form-columns">
                            <div className="form-column">
                                <Form.Item
                                    name="name"
                                    label="Họ và tên"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập họ và tên" },
                                        { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
                                        { max: 100, message: "Họ tên không được vượt quá 100 ký tự" }
                                    ]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                                </Form.Item>

                                <Form.Item
                                    name="username"
                                    label="Tên đăng nhập"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập tên đăng nhập" },
                                        { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" },
                                        { max: 50, message: "Tên đăng nhập không được vượt quá 50 ký tự" }
                                    ]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="tendangnhap" />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập Email' },
                                        { type: 'email', message: 'Email không hợp lệ' },
                                        { max: 100, message: "Email không được vượt quá 100 ký tự" }
                                    ]}
                                >
                                    <Input placeholder="example@email.com" />
                                </Form.Item>

                                <Form.Item
                                    name="phoneNumber"
                                    label="Số điện thoại"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                                        { pattern: /^(0[3|5|7|8|9])(\d{8})$/, message: 'Số điện thoại không hợp lệ' }
                                    ]}
                                >
                                    <Input placeholder="0912345678" maxLength={10} />
                                </Form.Item>
                            </div>

                            <div className="form-column">
                                <Form.Item
                                    name="password"
                                    label="Mật khẩu mới"
                                    tooltip="Để trống nếu không muốn thay đổi mật khẩu"
                                    rules={[
                                        { min: 6, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' },
                                        { max: 100, message: 'Mật khẩu mới không được vượt quá 100 ký tự' },
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
                                </Form.Item>

                                <Form.Item
                                    name="gender"
                                    label="Giới tính"
                                >
                                    <Radio.Group className="gender-radio-group">
                                        <Radio value={true}>Nam</Radio>
                                        <Radio value={false}>Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item
                                    name="birthDate"
                                    label="Ngày sinh"
                                >
                                    <DatePicker className="full-width-datepicker" format="DD/MM/YYYY" placeholder="Chọn ngày" />
                                </Form.Item>

                                <Form.Item name="storeName" label="Cửa hàng">
                                    <Input disabled />
                                </Form.Item>
                            </div>
                        </div>

                        <Form.Item name="storeID" hidden>
                            <Input />
                        </Form.Item>

                        <div className="update-employee-actions">
                            <Button type="primary" htmlType="submit" loading={isSubmitting} disabled={isSubmitting}>
                                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                            </Button>
                            <Button onClick={() => navigate("/store-owner/employee")} danger className="cancel-button" disabled={isSubmitting}>
                                Hủy
                            </Button>
                        </div>
                    </Form>

                    <Modal
                        open={previewVisible}
                        title={previewTitle}
                        footer={null}
                        onCancel={() => setPreviewVisible(false)}
                        className="preview-modal"
                    >
                        <img alt="Xem trước" style={{ width: "100%" }} src={previewImage} />
                    </Modal>
                </Card>
            )}
        </div>
    );
};

export default EmployeeUpdate;