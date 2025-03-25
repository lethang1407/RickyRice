import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, message, Select } from 'antd';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';

const CreateCategory = ({ onClose, storeID, fetchCategories, onSuccess }) => {
  const token = getToken();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();  

  const { TextArea } = Input;

  const handleCreateCategory = async (values) => {
    setLoading(true);
    const key = 'createCategoryKey'
    const newCategoryData = {
      name: values.name,
      description: values.description,
      storeID: storeID,
    };

    onSuccess(key);

    try {
      const response = await fetch(API.STORE_DETAIL.GET_CATEGORIES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newCategoryData),
      });

      if (!response.ok) throw new Error('Không thể tạo category mới');
      message.success('Tạo category mới thành công!');
      fetchCategories(); // Cập nhật danh sách zones
      onClose(); // Đóng modal
      form.resetFields(); // Reset form
    } catch (error) {
      console.error('Lỗi khi tạo category mới: ', error);
      message.error('Có lỗi xảy ra khi tạo category mới');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleCreateCategory}>
      <Form.Item label="Tên Loại Mới" name="name" rules={[{ required: true, message: <i>Vui lòng nhập tên khu!</i> }]}>
        <Input placeholder="Nhập loại" />
      </Form.Item>
      <Form.Item label="Mô Tả" name="description" rules={[{ required: true, message: <i>Vui lòng nhập mô tả!</i> }]}>
      <TextArea
          showCount
          maxLength={255}
          placeholder="Nhập mô tả"
          style={{ height: 120 }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Tạo Mới Loại
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateCategory;