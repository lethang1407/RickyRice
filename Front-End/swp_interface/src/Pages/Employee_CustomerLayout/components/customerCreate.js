import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Button, Form, Input, InputNumber, message, DatePicker, Select, Modal } from 'antd';
import { getToken } from '../../../Utils/UserInfoUtils';
import API from '../../../Utils/API/API';
import { success, error } from '../../../Utils/AntdNotification';

const { TextArea } = Input;

const CustomerIN4Create = ({ isVisible, closeModal, refreshData }) => {
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const customerData = location.state;
    const token = getToken();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        // if (customerData) {
        //     form.setFieldsValue({
        //         customerID: customerData.customerID,
        //         name: customerData.name,
        //         phoneNumber: customerData.phoneNumber,
        //         email: customerData.email,
        //         address: customerData.address,
        //         createdAt: moment(customerData.created_at),
        //         storeName: customerData.employeeStoreDTO ? customerData.employeeStoreDTO.storeName : "unknown",
        //     });
        // }

    }, [customerData, form]);

    const handleSubmit = async (values) => {
        try {
            const createdAt = moment().valueOf(); // Epoch timestamp (millisecond)
            const requestData = {
                employeeStoreDTO: {
                    storeID: values.store
                },
                name: values.name.trim(),
                phoneNumber: values.phoneNumber.trim(),
                email: values.email ? values.email.trim() : null,
                address: values.address ? values.address.trim() : null,
                createdBy: null
            };


            const response = await axios.post(
                API.EMPLOYEE.CREATE_CUSTOMER,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Thêm token vào header
                    },
                }
            );

            if (response.status === 200) {
                success('Tạo khách hàng mới thành công!', messageApi);
                form.resetFields();
                closeModal();
                console.log("Gọi hàm refreshData!");
                if (refreshData) refreshData();
            }
        } catch (err) {
            if (err.errorFields) {
                messageApi.open({
                    type: 'warning',
                    content: 'Vui lòng điền đầy đủ và đúng thông tin trước khi gửi!',
                });
            } else {
                error(err.response?.data?.message || "Tạo mới tài khoản thất bại.", messageApi);
            }
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="Tạo khách hàng mới"
                visible={isVisible} // Điều khiển hiển thị
                onCancel={closeModal} // Đóng Modal khi nhấn cancel
                footer={null} // Bỏ phần mặc định của Modal
            >
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item
                        label="Tên khách hàng"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                    >
                        <Input placeholder="Nhập tên khách hàng" />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phoneNumber"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^0\d{9}$/, message: 'Số điện thoại phải gồm 10 số và bắt đầu bằng 0!' },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                    >
                        <Input placeholder="Nhập email (nếu có)" />
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="address">
                        <TextArea rows={3} placeholder="Nhập địa chỉ của khách hàng" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="default" onClick={() => form.resetFields()}>
                            Reset
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: '8px' }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CustomerIN4Create;