import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, message, Select, Upload } from 'antd';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { handleUpload } from '../../../Utils/FetchUtils';
import { UploadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const UpdateProduct = ({ product, onClose, fetchProducts, onSuccess}) => {
  const token = getToken();
  const { id: storeID } = useParams();
  const [categories, setCategories] = useState([]);
  const [productAttributes, setProductAttributes] = useState([]);
  const [zones, setZones] = useState([]);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch danh mục theo storeID
  useEffect(() => {
    fetch(`${API.STORE_DETAIL.GET_CATEGORIES_BY_STOREID}?storeID=${storeID}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Không thể lấy danh sách danh mục.');
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh mục:', error);
        message.error('Không thể tải danh sách danh mục.');
      });
  }, [storeID, token]);

  // Fetch thuộc tính sản phẩm theo storeID
  useEffect(() => {
    fetch(`${API.STORE_DETAIL.GET_STORE_PRODUCT_ATTRIBUTES}?storeID=${storeID}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Không thể lấy thông tin thuộc tính sản phẩm.');
        return response.json();
      })
      .then((data) => {
        setProductAttributes(data.content);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy thông tin thuộc tính sản phẩm:', error);
        message.error('Không thể tải thông tin thuộc tính sản phẩm.');
      });
  }, [storeID, token]);

  //Lấy thông tin zone
  useEffect(() => {
    fetch(`${API.STORE_DETAIL.GET_STORE_ZONES}?storeID=${storeID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Không thể lấy thông tin zone.');
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setZones(data.content)
      })
      .catch((error) => {
        console.error('Lỗi khi lấy thông tin zone:', error);
        message.error('Không thể tải thông tin zone.');
      });
  }, [storeID, token]);

  // Đặt giá trị ban đầu cho form khi product thay đổi
  useEffect(() => {
    form.setFieldsValue({
      name: product.name,
      information: product.information,
      price: product.price,
      quantity: product.quantity,
      categoryID: product.categoryID,
      productAttributeList: product.productAttributeList ? product.productAttributeList : [],
      zoneList: product.zoneList ? product.zoneList : [],
    });
    // Nếu có ảnh sản phẩm, set fileList để hiển thị ảnh cũ
    if (product.productImage) {
      setFileList([
        {
          uid: '-1',
          name: 'product-image',
          status: 'done',
          url: product.productImage,
        },
      ]);
    }
  }, [product, form]);

  // Xử lý thay đổi khi upload ảnh
  const handleUploadImage = ({ fileList }) => {
    if (fileList && fileList.length > 0) {
      const fileObj = fileList[0].originFileObj;
      if (fileObj && !fileObj.type.startsWith('image/')) {
        message.error('Only accept image file!');
        return;
      }
      const isLt10M = fileObj.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('Image file size over 10MB!');
        return;
      }
      setFile(fileList);
    } else {
      setFile(null);
    }
    setFileList(fileList);
  };

  // Xử lý submit cập nhật sản phẩm
  const handleUpdateProduct = async (values) => {
    setLoading(true);
    const key = 'updateProductKey';
    try {
      let imageUrl = product.productImage; // Mặc định lấy ảnh cũ
      if (file && file.length > 0 && file[0].originFileObj) {
        const uploadResult = await handleUpload(API.PUBLIC.UPLOAD_IMG, file[0].originFileObj);
        imageUrl = uploadResult.data; // Lấy URL ảnh từ kết quả upload
      }

      const updatedProductData = {
        name: values.name,
        price: values.price,
        information: values.information,
        quantity: values.quantity,
        productImage: imageUrl,
        categoryID: values.categoryID,
        productAttributeList: values.productAttributeList ? values.productAttributeList : [],
        zoneList: values.zoneList ? values.zoneList : [],
      };

      onSuccess(key);

      const response = await fetch(`${API.STORE_DETAIL.UPDATE_STORE_PRODUCT(product.id)}&${storeID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProductData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật sản phẩm');
      }
      fetchProducts();
      onClose();
      form.resetFields();
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleUpdateProduct}>
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
        <Input.TextArea placeholder="Nhập mô tả" />
      </Form.Item>

      <Form.Item
        label="Số Lượng"
        name="quantity"
        rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
      >
        <InputNumber min={0} placeholder="Nhập số lượng" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Thuộc Tính Của Sản Phẩm"
        name="productAttributeList"
      >
        <Select mode="multiple" placeholder="Chọn thuộc tính của sản phẩm">
          {productAttributes.map((attribute) => (
            <Select.Option key={attribute.id} value={attribute.id}>
              {attribute.value}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Hình Ảnh" name="productImage">
        <Upload
          beforeUpload={() => false}
          onChange={handleUploadImage}
          maxCount={1}
          listType="picture"
          fileList={fileList}
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
          {categories.map((cat) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.description}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Khu Vực"
        name="zoneList"
      >
        <Select mode='multiple' placeholder="Chọn danh sách khu vực">
          {zones.map((zone) => (
            <Select.Option key={zone.id} value={zone.id}>
              {zone.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
          Cập Nhật Sản Phẩm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProduct;