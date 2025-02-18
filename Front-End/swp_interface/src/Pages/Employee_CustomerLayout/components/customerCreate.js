import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Button, Form, Input, InputNumber, message, DatePicker, Select } from 'antd';
import { getToken } from '../../../Utils/UserInfoUtils';
import API from '../../../Utils/API/API';

const { TextArea } = Input;

const CustomerIN4Create = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const customerData = location.state;
    console.log(customerData);
    const token = getToken();

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

            console.log("Dữ liệu gửi lên Backend:", requestData);
            if (response.status === 201) {
                message.success('Tạo khách hàng mới thành công!');
                navigate('/employee/customers');
            } else {
                message.error('Có lỗi xảy ra, vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
            message.error('Không thể gửi dữ liệu đến backend!');
        }
    };

    return (
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
                Thông tin khách hàng: <span style={{ color: '#000', textTransform: 'capitalize' }}></span>
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
                    label="Rice Store"
                    name="store"
                    rules={[{ required: true, message: 'Vui lòng chọn cửa hàng!' }]}
                >
                    <Select placeholder="Chọn cửa hàng">
                        <Select.Option value="1">Cửa hàng 1</Select.Option>
                        <Select.Option value="2">Cửa hàng 2</Select.Option>
                    </Select>
                </Form.Item>
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
                <Form.Item label="Created By" name="createdBy">
                    <Input value={null} disabled />
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
    );
};

export default CustomerIN4Create;