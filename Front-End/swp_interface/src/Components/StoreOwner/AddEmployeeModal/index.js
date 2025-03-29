import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, Radio, DatePicker, Upload, message, Spin } from 'antd';
import { UserOutlined, PlusOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import API from '../../../Utils/API/API';
import { success, error } from '../../../Utils/AntdNotification';
import './style.scss';

const { Option } = Select;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

const uploadImageAPI = async (url, token, file) => {
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


const createEmployeeAPI = async (url, token, employeeData) => {
    try {
        const response = await axios.post(url, employeeData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.data && response.data.success === false) {
            throw new Error(response.data.message || "Thêm nhân viên thất bại từ server.");
        }
        return response.data;
    } catch (err) {
        console.error("Lỗi khi thêm nhân viên (API):", err);
        throw new Error(err.response?.data?.message || err.message || "Thêm nhân viên thất bại.");
    }
};

const AddEmployeeModal = ({ visible, onClose, onSuccess, stores, token }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const UPLOAD_URL = `${API.STORE_OWNER.UPLOAD_EMPLOYEE_AVATAR}`;
    const CREATE_URL = `${API.STORE_OWNER.CREATE_STORE_EMPLOYEE}`;


    useEffect(() => {
        if (visible) {
            form.resetFields();
            setFileList([]);
        }
    }, [visible, form]);

    const handleAddEmployee = async (values) => {
        setIsSubmitting(true);
        let avatarUrl = null;

        try {
            if (fileList.length > 0 && fileList[0].originFileObj) {
                messageApi.open({ type: 'loading', content: 'Đang tải ảnh đại diện...', duration: 0 });
                try {
                    avatarUrl = await uploadImageAPI(UPLOAD_URL, token, fileList[0].originFileObj);
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
            } else {
                avatarUrl = "";
            }

            const employeePayload = {
                username: values.username,
                password: values.password,
                name: values.name,
                email: values.email,
                phoneNumber: values.phoneNumber,
                avatar: avatarUrl,
                birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
                gender: values.gender === true ? 1 : (values.gender === false ? 0 : null),
                storeId: values.storeId ? String(values.storeId) : null,
            };

            messageApi.open({ type: 'loading', content: 'Đang thêm nhân viên...', duration: 0 });
            await createEmployeeAPI(CREATE_URL, token, employeePayload);
            messageApi.destroy();
            success('Thêm nhân viên thành công!', messageApi);

            setTimeout(() => {
                form.resetFields();
                setFileList([]);
                if (onSuccess) onSuccess();
                onClose();
            }, 1000);

        } catch (err) {
            messageApi.destroy();
            console.error("Add employee failed:", err);
            error(err.message || "Thêm nhân viên thất bại", messageApi);
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
        setPreviewTitle(file.name || (file.url && file.url.substring(file.url.lastIndexOf('/') + 1)) || 'Preview');
    };

     const handleAvatarChange = async ({ file, fileList: newFileList }) => {
        if (file.status === 'removed') {
            setFileList([]);
            return;
        }

        if (file.originFileObj && file.status !== 'error' && file.status !== 'uploading') {
             try {
                const base64 = await getBase64(file.originFileObj);
                setFileList([{
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    originFileObj: file.originFileObj,
                    url: base64
                }]);
            } catch (e) {
                messageApi.error('Không thể đọc file ảnh.');
                setFileList([]);
            }
        }
    };


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
        </div>
    );

    return (
        <Modal
            title="Thêm Nhân Viên Mới"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            destroyOnClose
            className="add-employee-modal"
        >
            {contextHolder}
            <Spin spinning={isSubmitting} tip="Đang xử lý...">
                <Form form={form} layout="vertical" onFinish={handleAddEmployee} className="add-employee-form">
                    <Form.Item
                        name="avatar_display"
                        label="Ảnh đại diện"
                        className="avatar-uploader-item-modal"
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
                            onRemove={() => { setFileList([]); return true; }}
                            maxCount={1}
                        >
                            {fileList.length < 1 && uploadButton}
                        </Upload>
                    </Form.Item>

                    <div className="form-columns-modal">
                        <div className="form-column-modal">
                            <Form.Item
                                name="name"
                                label="Họ và tên"
                                rules={[
                                    { required: true, message: "Vui lòng nhập họ và tên" },
                                    { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
                                    { max: 100, message: "Họ tên không được vượt quá 100 ký tự" }
                                ]}
                             >
                                <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                            </Form.Item>
                             <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập Email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                    { max: 100, message: "Email không được vượt quá 100 ký tự" }
                                ]}
                              >
                                <Input prefix={<MailOutlined />} placeholder="example@email.com" />
                            </Form.Item>
                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^(0[3|5|7|8|9])(\d{8})$/, message: 'Số điện thoại không hợp lệ' }
                                ]}
                            >
                                <Input prefix={<PhoneOutlined />} placeholder="0xxxxxxxxx" maxLength={10}/>
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
                                <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[
                                    { required: true, message: "Vui lòng nhập mật khẩu" },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                                    { max: 100, message: 'Mật khẩu không được vượt quá 100 ký tự' },
                                ]}
                                hasFeedback
                             >
                                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                            </Form.Item>
                            <Form.Item
                                name="confirm"
                                label="Xác nhận Mật khẩu"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                        },
                                    }),
                                ]}
                             >
                                <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                            </Form.Item>
                        </div>
                        <div className="form-column-modal">
                            <Form.Item
                                name="storeId"
                                label="Cửa Hàng"
                                rules={[{ required: true, message: "Vui lòng chọn cửa hàng" }]}
                             >
                                <Select
                                    placeholder="Chọn cửa hàng"
                                    allowClear
                                    loading={!stores || stores.length === 0}
                                >
                                    {stores?.map((store) => (
                                        <Option key={store.storeID} value={store.storeID}>
                                            {store.name || `Cửa hàng ID: ${store.storeID}`}
                                        </Option>
                                    ))}
                                </Select>
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
                                <DatePicker
                                    className="full-width-datepicker"
                                    format="DD/MM/YYYY"
                                    placeholder="Chọn ngày sinh"
                                    disabledDate={(current) => current && current > moment().endOf('day')}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item className="form-actions-modal">
                        <Button onClick={onClose} style={{ marginRight: 8 }} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isSubmitting} disabled={isSubmitting}>
                            {isSubmitting ? 'Đang thêm...' : 'Thêm Nhân Viên'}
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>

            <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={() => setPreviewVisible(false)} className="preview-modal">
                <img alt="preview" style={{ width: "100%" }} src={previewImage} />
            </Modal>
        </Modal>
    );
};

export default AddEmployeeModal;