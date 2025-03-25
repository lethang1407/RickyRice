import React, { useEffect, useState  } from "react";
import API from '../../../Utils/API/API';
import { Form, Button, Input, message } from 'antd';
import { getToken } from "../../../Utils/UserInfoUtils";

const UpdateProductAttribute = ({ onClose, storeID, attribute, fetchAttributes, onSuccess }) => {
  const token = getToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    form.setFieldsValue({
      value: attribute.value,
      storeID: storeID,
    });
  }, [attribute, token, form]);

  const handleUpdateProductAttribute = async (values) => {
    setLoading(true);
    const key = 'updateProductAttributeKey'
    const updatedAttributeData = {
      value: values.value,
      storeID: storeID,
    };

    onSuccess(key);

    try {
      const response = await fetch(API.STORE_DETAIL.UPDATE_STORE_PRODUCT_ATTRIBUTE(attribute.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAttributeData),
      });

      if (!response.ok) throw new Error('Không thể cập nhật thuộc tính sản phẩm');
      message.success('Cập nhật thuộc tính sản phẩm thành công!');
      fetchAttributes(); // Cập nhật danh sách thuộc tính sản phẩm
      onClose(); // Đóng modal
    } catch (error) {
      console.error('Lỗi khi cập nhật thuộc tính sản phẩm: ', error);
      message.error('Có lỗi xảy ra khi cập nhật thuộc tính sản phẩm');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleUpdateProductAttribute}>
      <Form.Item
        label="Tên Thuộc Tính"
        name="value"
        rules={[{ required: true, message: 'Xin hãy nhập tên thuộc tính' }]}
      >
        <Input placeholder="Nhập tên thuộc tính mới" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Cập Nhật Thuộc Tính
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProductAttribute;