import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, message, Select, Upload } from 'antd';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { handleUpload } from '../../../Utils/FetchUtils'; // Keeping handleUpload for now, will adjust if needed
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { error } from "../../../Utils/AntdNotification";
import axios from 'axios';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

const UpdateProduct = ({ product, onClose, fetchProducts, onSuccess }) => {
  const token = getToken();
  const { id: storeID } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [categories, setCategories] = useState([]);
  const [productAttributes, setProductAttributes] = useState([]);
  const [zones, setZones] = useState([]);
  const [form] = Form.useForm();
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
    fetch(`${API.STORE_DETAIL.GET_STORE_PRODUCT_ATTRIBUTES}?storeID=${storeID}&size=100`, {
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
    fetch(`${API.STORE_DETAIL.GET_STORE_ZONES}?storeID=${storeID}&size=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Không thể lấy thông tin zone.');
        return response.json();
      })
      .then((data) => {
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
    } else {
      setFileList([]); // Ensure fileList is empty if no existing image
    }
  }, [product, form]);

  // Xử lý thay đổi khi upload ảnh
  const handleUploadImage = async ({ file, fileList: newFileList }) => {
      if (file.status === 'removed') {
          setFileList([]);
          return;
      }

      try {
          if (file.originFileObj) { // Check if it's a new file upload
              const preview = await getBase64(file.originFileObj);
              setFileList([{
                  uid: file.uid,
                  name: file.name,
                  status: 'done',
                  originFileObj: file.originFileObj,
                  url: preview
              }]);
          } else if (file.url) { // Handling cases where url is already present (initial load or no change)
              setFileList([{
                  uid: file.uid,
                  name: file.name,
                  status: 'done',
                  url: file.url
              }]);
          }
      } catch (uploadError) {
          messageApi.error('Không thể tải ảnh lên');
          setFileList([]);
      }
  };


  const beforeUpload = (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
          messageApi.error('Bạn chỉ có thể tải lên file JPG/PNG!');
          return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2; // Adjusted to 2MB as in ProductUpdate
      if (!isLt2M) {
          messageApi.error('Ảnh phải nhỏ hơn 2MB!');
          return Upload.LIST_IGNORE;
      }
      return true;
  };


  // Xử lý submit cập nhật sản phẩm
  const handleUpdateProduct = async (values) => {
    setLoading(true);
    const key = 'updateProductKey';
    let imageUrl = null;
    try {
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const uploadResult = await handleUpload(API.PUBLIC.UPLOAD_IMG, fileList[0].originFileObj);
        imageUrl = uploadResult.data;
      } else if (fileList.length > 0 && fileList[0].url) {
        imageUrl = fileList[0].url; // Use existing URL if no new file uploaded
      }

      const updatedProductData = {
        name: values.name,
        price: values.price,
        information: values.information,
        productImage: imageUrl,
        categoryID: values.categoryID,
        productAttributeList: values.productAttributeList ? values.productAttributeList : [],
        zoneList: values.zoneList ? values.zoneList : [],
      };

      const response = await axios.put(`${API.STORE_DETAIL.UPDATE_STORE_PRODUCT(product.id)}&${storeID}`, updatedProductData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        onSuccess(key);
        fetchProducts();
        onClose();
        form.resetFields();
      }
      setLoading(false);
    } catch (err) {
      error(err.response?.data?.message || "Cập nhật sản phẩm thất bại", messageApi);
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      {
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

          <Form.Item label="Hình Ảnh" name="productImage" className="avatar-uploader-item">
              <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleUploadImage}
                  maxCount={1}
              >
                  {fileList.length > 0 ? (
                      <img
                          src={fileList[0].url}
                          alt="product"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                  ) : (
                      <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Tải lên</div>
                      </div>
                  )}
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
      }
    </>
  );
};

export default UpdateProduct;