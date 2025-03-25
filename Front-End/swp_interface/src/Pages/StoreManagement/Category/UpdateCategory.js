import React, { useEffect, useState } from "react";
import API from '../../../Utils/API/API';
import { Form, Button, Input, message } from 'antd';
import { getToken } from "../../../Utils/UserInfoUtils";

const UpdateCategory = ({ onClose, storeID, category, fetchCategories, onSuccess }) => {
  const token = getToken();
  const [form] = Form.useForm();
  const[loading, setLoading] = useState(false);
  const { TextArea } = Input;

  useEffect(() => {
    console.log(category.id);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      storeID: storeID,
    });
  }, [fetchCategories, token]);

  const handleUpdateCategory = async (values) => {
    setLoading(true);
    const key = 'updateCategoryKey'
    const updatedCategoryData = {
      name: values.name,
      description: values.description,
      storeID: storeID,
    };

    onSuccess(key);

    try {
      const response = await fetch(API.STORE_DETAIL.UPDATE_STORE_CATEGORY(category.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCategoryData),
      });

      if (!response.ok) throw new Error('Không thể cập nhật category');
      message.success('Cập nhật category thành công!');
      fetchCategories(); // Cập nhật danh sách zones
      onClose(); // Đóng modal
    } catch (error) {
      console.error('Lỗi khi cập nhật category: ', error);
      message.error('Có lỗi xảy ra khi cập nhập category');
    } finally {
    setLoading(false);
    }
  } 

  return (
    <Form form={form} layout="vertical" onFinish={handleUpdateCategory}>
      <Form.Item
        label="Tên Loại"
        name="name"
        rules={[
          { required: true, message: 'Xin hãy nhập tên loại' },
        ]}
      >
        <Input placeholder="Nhập tên loại mới"/>
      </Form.Item>
      <Form.Item
        label="Mô Tả"
        name="description"
        rules={[
          { required: true, message: 'Xin hãy nhập mô tả đừng để trống' },
        ]}
      >
        <TextArea
          showCount
          maxLength={255}
          placeholder="Nhập mô tả"
          style={{ height: 120 }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Cập Nhật Thể Loại Gạo
        </Button>
      </Form.Item>
    </Form>
  );
};
export default UpdateCategory;