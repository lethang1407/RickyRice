import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Card, Input, Button, Form, DatePicker, Radio, Upload, Modal, message, Avatar } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
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
            return response.data;
        } else {
            throw new Error("Tải ảnh đại diện lên thất bại: Không có URL trả về.");
        }
    } catch (err) {
        console.error("Lỗi khi tải ảnh đại diện lên (API):", err);
        throw new Error(err.response?.data?.message || "Tải ảnh đại diện lên thất bại.");
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getDataWithToken(
                    `${API.STORE_OWNER.GET_STORE_EMPLOYEE_DETAIL}?id=${employeeID}`,
                    token
                );
                const initialFileList = response.storeAccount.avatar
                    ? [{ uid: '-1', name: 'avatar.png', status: 'done', url: response.storeAccount.avatar }]
                    : [];
                setFileList(initialFileList);


                form.setFieldsValue({
                    name: response.storeAccount.name,
                    email: response.storeAccount.email,
                    phoneNumber: response.storeAccount.phoneNumber,
                    gender: response.storeAccount.gender,
                    birthDate: response.storeAccount.birthDate ? moment(response.storeAccount.birthDate) : null,
                    storeName: response.storeInfo.storeName,
                    storeID: response.storeInfo.storeID,
                });


            } catch (err) {
                error(err.message || "Không thể tải chi tiết nhân viên", messageApi);
                navigate("/store-owner/employee");
            } finally {
                setLoading(false);
            }
        };


        if (employeeID) {
            fetchData();
        }
    }, [employeeID, token, navigate, form, messageApi]);


    const handleUpdate = async (values) => {
        setIsSubmitting(true);
        let avatarUrl = null;


        try {
            if (fileList.length > 0 && fileList[0].originFileObj) {
                avatarUrl = await uploadAvatarAPI(UPLOAD_AVATAR_URL, token, fileList[0].originFileObj);
                if (!avatarUrl) return;
            } else if (fileList.length > 0 && fileList[0].url) {
                avatarUrl = fileList[0].url;
            } else {
                avatarUrl = "";
            }


            const employee = {
                employeeID: employeeID,
                storeAccount: {
                    name: values.name,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    gender: values.gender,
                    birthDate: values.birthDate ? values.birthDate.toISOString() : null,
                    avatar: avatarUrl,
                },
            };
            await updateEmployeeAPI(UPDATE_EMPLOYEE_URL, token, employee);
            success('Cập nhật nhân viên thành công!', messageApi);
            setTimeout(() =>
                navigate("/store-owner/employee"),
                1000
            )
        } catch (err) {
            console.log(err);
            error(err.message || "Cập nhật nhân viên thất bại", messageApi);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
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
                <Card title="Cập nhật nhân viên" className="update-employee-card">
                    <Form form={form} layout="vertical" onFinish={handleUpdate} className="update-employee-form">
                        <Form.Item
                            name="avatar"
                            label="Ảnh đại diện"
                            className="avatar-uploader-item"
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                                    if (!isJpgOrPng) {
                                        messageApi.error('Bạn chỉ có thể tải lên file JPG/PNG!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                    if (!isLt2M) {
                                        messageApi.error('Ảnh phải nhỏ hơn 2MB!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    return false;
                                }}
                                onPreview={handlePreview}
                                onChange={async ({ file, fileList }) => {
                                    if (file.status === 'removed') {
                                        setFileList([]);
                                        return;
                                    }


                                    try {
                                        const preview = await getBase64(file);
                                        setFileList([{
                                            uid: file.uid,
                                            name: file.name,
                                            status: 'done',
                                            originFileObj: file,
                                            url: preview
                                        }]);
                                    } catch (error) {
                                        messageApi.error('Không thể tải ảnh lên');
                                    }
                                }}
                                maxCount={1}
                            >
                                {fileList.length > 0 ? (
                                    <Avatar
                                        size={100}
                                        src={fileList[0].url}
                                        icon={<UserOutlined />}
                                        className="uploaded-avatar"
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Form.Item>


                        <div className="form-columns">
                            <div className="form-column">
                                <Form.Item
                                    name="name"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                                >
                                    <Input prefix={<UserOutlined />} />
                                </Form.Item>


                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Email!',
                                        }, {
                                            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Email is not Valid!'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>


                                <Form.Item
                                    name="phoneNumber"
                                    label="Số điện thoại"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Phone Number!',
                                        },
                                        {
                                            pattern: /^(0[3|5|7|8|9])(\d{8})$/,
                                            message: 'Phone Number is not Valid!'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                            <div className="form-column">
                                <Form.Item
                                    name="gender"
                                    label="Giới tính"
                                    rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                                >
                                    <Radio.Group className="gender-radio-group">
                                        <Radio value={true}>Nam</Radio>
                                        <Radio value={false}>Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>


                                <Form.Item
                                    name="birthDate"
                                    label="Ngày sinh"
                                    rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
                                >
                                    <DatePicker className="full-width-datepicker" format="DD/MM/YYYY" />
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
                            <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                Cập nhật
                            </Button>
                            <Button onClick={() => navigate("/store-owner/employee")} danger className="cancel-button">
                                Hủy
                            </Button>
                        </div>
                    </Form>


                    <Modal
                        visible={previewVisible}
                        title={previewTitle}
                        footer={null}
                        onCancel={() => setPreviewVisible(false)}
                        className="preview-modal"
                    >
                        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
                    </Modal>
                </Card>
            )}
        </div>
    );
};


export default EmployeeUpdate;

