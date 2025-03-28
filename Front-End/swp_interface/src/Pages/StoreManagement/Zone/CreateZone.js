import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';

const CreateZone = ({ onClose, storeID, fetchZones, onSuccess }) => {
  const token = getToken();
  const [products, setProducts] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetch(`${API.STORE_DETAIL.GET_STORE_PRODUCTS}?storeID=${storeID}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Không thể lấy danh sách sản phẩm.');
        return response.json();
      })
      .then((data) => {
        setProducts(data.content)
      })
      .catch((error) => {
        console.error('Lỗi khi lấy sản phẩm:', error);
        message.error('Không thể tải danh sách sản phẩm.');
      });
  }, [storeID, token]);

  const handleCreateZone = async (values) => {
    const key = 'createZoneKey'
    const newZoneData = {
      name: values.name,
      location: values.location,
      storeID: storeID,
      productID: values.productID,
    };

    onSuccess(key);

    try {
      const response = await fetch(API.STORE_DETAIL.GET_STORE_ZONES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newZoneData),
      });

      if (!response.ok) throw new Error('Không thể tạo zone mới');
      message.success('Tạo zone mới thành công!');
      fetchZones(); // Cập nhật danh sách zones
      onClose(); // Đóng modal
      form.resetFields(); // Reset form
    } catch (error) {
      console.error('Lỗi khi tạo zone mới: ', error);
      message.error('Có lỗi xảy ra khi tạo zone mới');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleCreateZone}>
      <Form.Item label="Tên Khu" name="name" rules={[{ required: true, message: <i>Vui lòng nhập tên khu!</i> }]}>
        <Input placeholder="Nhập tên khu" />
      </Form.Item>
      <Form.Item label="Phân Khu" name="location" rules={[{ required: true, message: <i>Vui lòng nhập phân khu!</i> }]}>
        <Input placeholder="Nhập phân khu" />
      </Form.Item>
      <Form.Item label="Sản phẩm" name="productID" rules={[{ message: <i>Vui lòng chọn sản phẩm!</i> }]}>
        <Select placeholder="Chọn sản phẩm">
          {products.map((product) => (
            <Select.Option key={product.id} value={product.id}>
              {product.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Tạo Zone
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateZone;