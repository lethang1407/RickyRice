import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, message, Select, Upload } from 'antd';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { handleUpload } from '../../../Utils/FetchUtils';
import { UploadOutlined } from '@ant-design/icons';

const CreateProduct = ({ onClose, storeID, fetchProducts }) => {
  const token = getToken();
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

    // Helper function for displaying errors
    const error = (msg, messageApi) => {
      messageApi.open({
        type: 'error',
        content: msg,
      });
    };

    // Helper function for displaying success
    const success = (msg, messageApi) => {
      messageApi.open({
        type: 'success',
        content: msg,
      });
    };


  // Lấy danh sách danh mục
  useEffect(() => {
    fetch(`${API.STORE_DETAIL.GET_CATEGORIES_BY_STOREID}?storeID=${storeID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Không thể lấy danh sách danh mục.');
        return response.json();
      })
      .then((data) => setCategories(data))
      .catch((error) => {
        console.error('Lỗi khi lấy danh mục:', error);
        message.error('Không thể tải danh sách danh mục.');
      });
  }, [storeID, token]);

  // Xử lý upload ảnh
  const handleUploadImage = async (info) => {
    if (info.fileList.length > 0) {
      if (!info.fileList[0].originFileObj.type.startsWith('image/')) {
        message.error('Only accept image file!'); // Use message directly
        return;
      }
      const fileSize = info.fileList[0].originFileObj.size / 1024 / 1024 < 10;
      if (!fileSize) {
        message.error('Image file size over 10MB!'); // Use message directly
        return;
      }
      setFile(info.fileList);
    } else {
      setFile(null);
    }
  };

  // Xử lý submit form
  const handleCreateProduct = async (values) => {
    setLoading(true); // Start loading

    try {
      let imageUrl = null;
      if (file) {
        const uploadResult = await handleUpload(API.PUBLIC.UPLOAD_IMG, file[0].originFileObj);
        imageUrl = uploadResult.data; // Assuming the URL is in uploadResult.data
      }

      const newProductData = {
        name: values.name,
        price: values.price,
        information: values.information,
        quantity: values.quantity,
        productImage: imageUrl,  // Use the uploaded image URL
        storeDetailCategoryDTO: { id: values.categoryID },
        storeID: storeID,
      };


      const response = await fetch(API.STORE_DETAIL.GET_STORE_PRODUCTS_BY_STOREID + '?storeID=' + storeID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProductData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo sản phẩm mới');
      }

      message.success('Tạo sản phẩm mới thành công!');
      fetchProducts();
      onClose();
      form.resetFields();
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm mới: ', error);
      message.error(error.message || 'Có lỗi xảy ra khi tạo sản phẩm mới');
    } finally {
      setLoading(false); // Stop loading, regardless of success or failure
    }
  };



  return (
    <Form form={form} layout="vertical" onFinish={handleCreateProduct}>
      <Form.Item
        label="Tên Sản Phẩm"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
      >
        <Input placeholder="Nhập tên sản phẩm" />
      </Form.Item>

      <Form.Item
        label="Giá"
        name="price"
        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
      >
        <InputNumber min={0} placeholder="Nhập giá" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Mô Tả"
        name="information"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
      >
        <Input placeholder="Nhập mô tả" />
      </Form.Item>

      <Form.Item
        label="Số Lượng"
        name="quantity"
        rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
      >
        <InputNumber min={0} placeholder="Nhập số lượng" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Hình Ảnh"
        name="productImage"
      >
        <Upload
          beforeUpload={() => false}
          onChange={handleUploadImage}
          maxCount={1}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Tải ảnh sản phẩm lên</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Danh Mục"
        name="categoryID"
        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
      >
        <Select placeholder="Chọn danh mục">
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.description}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
          Tạo Sản Phẩm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProduct;