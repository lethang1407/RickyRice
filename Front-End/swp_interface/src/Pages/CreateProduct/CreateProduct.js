import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    DatePicker,
    Upload,
    message,
} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const FormDisabledDemo = () => {
    const [categories, setCategories] = useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();


    useEffect(() => {
        axios
            .get('http://localhost:9999/home/owner/products/CreateProduct')
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh mục từ API:', error);
                message.error('Không thể lấy danh mục, vui lòng thử lại sau!');
            });
    }, []);


    const handleSubmit = async (values) => {
        try {

            const requestData = {
                categoryID: values.category,
                store: values.store,
                name: values.name,
                price: values.price,
                createdAt: null,
                updatedAt: null,

                info: values.info,
                image: "hehe.jpg",
                createdBy: "1",
            };


            const response = await axios.post(
                'http://localhost:9999/home/owner/products',
                requestData
            );


            if (response.status === 200 || response.status === 201) {
                message.success('Tạo sản phẩm thành công!');
                navigate('/home/owner/products');
            } else {
                message.error('Lỗi khi tạo sản phẩm, vui lòng thử lại!');
            }
        } catch (error) {

            console.error('Lỗi khi gửi dữ liệu đến backend:', error);
            message.error('Không thể gửi dữ liệu đến backend, ');
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
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Tạo mới sản phẩm</h2>
            <Form
                form={form}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 16,
                }}
                layout="horizontal"
                style={{
                    maxWidth: '100%',
                }}
                onFinish={handleSubmit}
            >

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                    <Radio.Group>
                        {categories.map((category) => (
                            <Radio key={category.categoryID} value={category.categoryID}>
                                {category.name}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>


                <Form.Item
                    label="Rice Store"
                    name="store"
                    rules={[{ required: true, message: 'Vui lòng chọn cửa hàng!' }]}
                >
                    <Select placeholder="Chọn cửa hàng">
                        <Select.Option value="1">Cửa hàng 1</Select.Option>
                        <Select.Option value="2">Cửa hàng 2</Select.Option>
                        <Select.Option value="3">Cửa hàng 3</Select.Option>
                    </Select>
                </Form.Item>


                <Form.Item
                    label="Rice Name"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                    ]}
                >
                    <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>
                <Form.Item
                    label="Rice Price"
                    name="price"
                    rules={[
                        { required: true, message: 'Vui lòng nhập Giá sản phẩm!' },
                    ]}
                >
                    <InputNumber min={1} placeholder="Nhập giá gạo" style={{ width: '100%' }} />
                </Form.Item>


                <Form.Item
                    label="Created At"
                    name="createdAt"
                    rules={[{ required: false, message: 'Vui lòng chọn ngày tạo!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>


                <Form.Item
                    label="Updated At"
                    name="updatedAt"
                    rules={[{ required: false, message: 'Vui lòng chọn ngày cập nhật!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Information"
                    name="info"
                >
                    <TextArea rows={4} placeholder="Nhập thông tin sản phẩm" />
                </Form.Item>


                <Form.Item
                    label="Rice Image"
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                        { required: true, message: 'Vui lòng tải lên ít nhất một ảnh!' },
                    ]}
                >
                    <Upload action="/upload.do" listType="picture-card">
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </Upload>
                </Form.Item>


                <Form.Item label="Created By" name="createdBy">
                    <Input value="1" disabled />
                </Form.Item>


                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>

                    <Button
                        type="default"
                        htmlType="button"
                        onClick={() => navigate('/employee/products')}
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
                    <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FormDisabledDemo;