import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, notification } from 'antd';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { success, error } from '../../../Utils/AntdNotification';
const { Option } = Select;

const InvoiceCustomerCreate = ({ onCustomerCreated }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const token = getToken();
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields();
    };

    const handleReset = () => {
        form.resetFields();
    };
    const handleSubmit = async () => {
        setLoading(true)
        try {
            const values = await form.validateFields();
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
            console.log("Dữ liệu gửi lên Backend thanh cong :", requestData);
            success("Tạo khách hàng mới thành công", messageApi);
            if (onCustomerCreated) {
                onCustomerCreated(values.phoneNumber.trim(), values.name.trim());
            }
            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (err) {
            if (err.errorFields) {
                messageApi.open({
                    type: 'warning',
                    content: 'Vui lòng điền đầy đủ và đúng thông tin trước khi gửi!',
                });
            } else {
                error(err.response?.data?.message || "Tạo mới tài khoản thất bại.", messageApi);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
            </Button>
            <Drawer
                title="Tạo khách hàng mới"
                width={720}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button
                            htmlType="button"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={() => {
                                handleSubmit();
                            }}
                            type="primary"
                            loading={loading}
                        >
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form form={form} layout="vertical" hideRequiredMark validateTrigger="onSubmit">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên Khách Hàng"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập tên khách hàng(đại lý)!!!',
                                    },
                                    {
                                        validator: (_, value) => {
                                            if (!value || value.trim() === '') {
                                                return Promise.reject(new Error('Tên không được chỉ chứa khoảng trắng!'));
                                            }
                                            if (value.length > 50) {
                                                return Promise.reject(new Error('Tên không được vượt quá 50 ký tự!'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }]}
                            >
                                <Input maxLength={50} placeholder="Nhập Tên Khách Hàng" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Số Điện Thoại"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Cần có số điện thoại',
                                    },
                                    {
                                        pattern: /^0\d{9}$/,
                                        message: 'Vui lòng nhập 10 số và bắt đầu từ 0',
                                    }
                                ]}
                            >
                                <Input type='number' max={10}
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Nhập Số điện Thoại"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"

                                rules={[
                                    {
                                        type: 'email',
                                        message: 'Email không đúng định dạng',
                                    }
                                ]}
                            >
                                <Input placeholder="Nhập Email của khách hàng" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="address"
                                label="Địa Chỉ"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Vui lòng nhập địa chỉ',
                                    },
                                ]}
                            >
                                <Input.TextArea maxLength={100} rows={4} placeholder="Nhập mô tả địa chỉ khách hàng" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default InvoiceCustomerCreate;