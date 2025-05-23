import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

import { getToken } from '../../../Utils/UserInfoUtils';
import { Button, Form, Input, InputNumber, message, DatePicker, Select } from 'antd';
import API from '../../../Utils/API/API';
import { success, error } from '../../../Utils/AntdNotification';


const { TextArea } = Input;

const CustomerIN4Edit = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const customerData = location.state;
    const token = getToken();
    const [messageApi, contextHolder] = message.useMessage();


    useEffect(() => {
        if (customerData) {
            form.setFieldsValue({
                customerID: customerData.customerID,
                name: customerData.name,
                phoneNumber: customerData.phoneNumber,
                email: customerData.email,
                address: customerData.address,
                createdAt: moment(customerData.created_at),
                storeName: customerData.employeeStoreDTO ? customerData.employeeStoreDTO.storeName : "unknown",
            });
        }
    }, [customerData, form]);

    const handleSubmit = async (values) => {
        console.log('hoi chjam vcl2');
        try {
            console.log('hoi chjam vcl');
            const requestData = {
                customerID: customerData.customerID,
                name: values.name,
                phoneNumber: values.phoneNumber,
                email: values.email,
                address: values.address,
                // createdAt: customerData.created_at,
                updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss'),
            };

            const response = await axios.put(

                API.EMPLOYEE.UPDATE_USER(customerData.customerID), // URL endpoint
                requestData, // Dữ liệu request payload
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Thêm token vào header
                    },
                }
            );
            console.log("Status:", response.status);
            if (response.status === 200) {
                success('Cập nhật khách hàng thành công!', messageApi);
            }
        } catch (err) {
            error(err.response?.data?.message || "Tạo mới tài khoản thất bại.", messageApi);
        }
    };

    return (
        <>
            {contextHolder}
            <div
                style={{
                    margin: '50px auto',
                    padding: '30px',
                    maxWidth: 800,
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h2
                    style={{
                        textAlign: 'center',
                        marginBottom: '30px',
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#1890ff',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}
                >
                    Thông tin khách hàng: <span style={{ color: '#000', textTransform: 'capitalize' }}>{customerData.name}</span>
                </h2>
                <Form
                    form={form}
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    layout="horizontal"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Customer Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên!' },
                        ]}
                    >
                        <Input placeholder="Nhập tên khách hàng" />
                    </Form.Item>
                    <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            {
                                pattern: /^0\d{9}$/,
                                message: 'Vui lòng nhập 10 số và bắt đầu từ 0',
                            }
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item
                        label="Customer Email"
                        name="email"
                        rules={[
                            { required: false, type: 'email', message: 'Vui lòng nhập Email hợp lệ!' },
                        ]}
                    >
                        <Input placeholder="Nhập Email của khách hàng" />
                    </Form.Item>
                    <Form.Item label="Customer Address" name="address">
                        <TextArea rows={3} placeholder="Nhập địa chỉ" />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button
                            type="default"
                            htmlType="button"
                            onClick={() => navigate('/employee/customers')}
                        >
                            Back
                        </Button>
                        <Button
                            htmlType="button"
                            onClick={() => {
                                form.resetFields();
                            }}
                        >
                            Reset
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: '8px' }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default CustomerIN4Edit;