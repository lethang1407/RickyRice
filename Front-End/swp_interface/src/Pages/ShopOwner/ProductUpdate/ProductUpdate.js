import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Card, Input, Button, Form, Select, Upload, Modal, InputNumber, message } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import API from "../../../Utils/API/API";
import { getToken } from "../../../Utils/UserInfoUtils";
import { getDataWithToken } from "../../../Utils/FetchUtils";
import "./style.scss";
import { success, error } from '../../../Utils/AntdNotification';

const { Option } = Select;

// Hàm hỗ trợ lấy base64 của file ảnh (để preview)
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject; // Xử lý lỗi ngắn gọn hơn
    });

// Hàm API để upload ảnh
const uploadImageAPI = async (url, token, file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.put(url, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data) {
            return response.data; // Giả định backend trả về URL trực tiếp
        } else {
            throw new Error("Tải ảnh lên thất bại: Không có URL trả về.");  // Lỗi cụ thể hơn
        }
    } catch (err) {
        console.error("Lỗi khi tải ảnh lên (API):", err);
        throw new Error(err.response?.data?.message || "Tải ảnh lên thất bại."); // Xử lý lỗi API và lỗi chung
    }
};

// Hàm API để cập nhật thông tin sản phẩm
const updateProductAPI = async (url, token, product) => {
    try {
        const response = await axios.put(url, product, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.data && response.data.success === false) {
            throw new Error(response.data.message || "Cập nhật sản phẩm thất bại từ server.");
        }
        return response.data;

    } catch (err) {
        console.error("Lỗi khi cập nhật sản phẩm (API):", err);
        throw new Error(err.response?.data?.message || err.message || "Cập nhật sản phẩm thất bại.");
    }
};



const ProductUpdate = () => {
    const location = useLocation();
    const { productID } = location.state || {};
    const { storeId } = location.state || {};
    const navigate = useNavigate();
    const token = getToken();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [zones, setZone] = useState([]);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState(''); // Đã khai báo previewTitle
    const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái duy nhất cho cả upload và update
    const [messageApi, contextHolder] = message.useMessage();
    const UPLOAD_IMAGE_URL = `${API.STORE_OWNER.UPLOAD_PRODUCT_IMAGE}/${productID}`;
    const UPDATE_PRODUCT_URL = `${API.STORE_OWNER.UPDATE_STORE_PRODUCT}/${productID}`;

    // useEffect để tải dữ liệu ban đầu (chi tiết sản phẩm, danh mục, thuộc tính, khu vực)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const productResponse = await getDataWithToken(`${API.STORE_OWNER.GET_STORE_PRODUCT_DETAIL}?id=${productID}`, token);
                const initialFileList = productResponse.productImage
                    ? [{ uid: '-1', name: 'image.png', status: 'done', url: productResponse.productImage }]
                    : [];
                setFileList(initialFileList);

                form.setFieldsValue({
                    ...productResponse,
                    category: productResponse.category?.id,
                    attributes: productResponse.attributes?.map((attr) => attr.value) || [],
                    zones: productResponse.zones?.map((z) => z.id) || [],
                    storeId: productResponse.store?.id,
                    storeName: productResponse.store?.name,
                });

                const [categoriesResponse, attributesResponse, zonesResponse] = await Promise.all([
                    getDataWithToken(API.STORE_OWNER.GET_CATEGORIES, token),
                    getDataWithToken(API.STORE_OWNER.GET_ATTRIBUTES, token),
                    storeId ? getDataWithToken(`${API.STORE_OWNER.GET_ZONES}?storeId=${storeId}`, token) : Promise.resolve([])
                ]);

                setCategories(categoriesResponse);
                setAttributes(attributesResponse);
                setZone(zonesResponse);

            } catch (err) {
                error(err.message || "Không thể tải dữ liệu", messageApi);
                navigate("/store-owner/product");
            } finally {
                setLoading(false);
            }
        };

        if (productID) {
            fetchData();
        }
    }, [productID, storeId, token, navigate, form, messageApi]);


    // Hàm xử lý chính khi submit form để cập nhật sản phẩm
    const handleUpdate = async (values) => {
        setIsSubmitting(true);
        let imageUrl = null;

        try {
            // 1. Xử lý ảnh (Tải lên, Giữ nguyên, hoặc Xóa)
            if (fileList.length > 0 && fileList[0].originFileObj) {
                // Ảnh mới được tải lên: Tải lên trước.
                imageUrl = await uploadImageAPI(UPLOAD_IMAGE_URL, token, fileList[0].originFileObj);
                if (!imageUrl) return; // Dừng nếu tải lên thất bại.
            } else if (fileList.length > 0 && fileList[0].url) {
                // Ảnh hiện có: Giữ nguyên URL hiện tại.
                imageUrl = fileList[0].url;
            } else {
                // Ảnh bị xóa
                imageUrl = "";
            }

            // 2. Chuẩn bị dữ liệu sản phẩm
            const categoryObj = {
                id: values.category,
                name: categories.find((cat) => cat.id === values.category)?.name || "",
            };

            const storeObj = {
                id: form.getFieldValue("storeId"),
                name: values.storeName,
            };

            const attributesArray = values.attributes.map((attrValue) => {
                const fullAttr = attributes.find((attr) => attr.value === attrValue);
                return {
                    id: fullAttr ? fullAttr.id : "",
                    value: attrValue,
                };
            });

            const zonesArray = values.zones.map((zoneId) => {
                const fullZone = zones.find((z) => z.id === zoneId);
                return {
                    id: zoneId,
                    name: fullZone ? fullZone.name : "",
                };
            });

            const product = {
                productID: productID, // Đảm bảo có productID
                name: values.name,
                price: parseFloat(values.price),
                information: values.information,
                category: categoryObj,
                attributes: attributesArray,
                quantity: parseInt(values.quantity, 10),
                store: storeObj,
                zones: zonesArray,
                productImage: imageUrl, // Sử dụng URL ảnh đã tải lên/hiện có/null
            };

            // 3. Cập nhật sản phẩm (sử dụng URL ảnh đã lấy được)
            await updateProductAPI(UPDATE_PRODUCT_URL, token, product);
            success('Cập nhật sản phẩm thành công!', messageApi);
            navigate("/store-owner/product");

        } catch (err) {
            error(err.message || "Cập nhật sản phẩm thất bại", messageApi); // Hiển thị thông báo lỗi
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hàm xử lý xem trước ảnh
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1)); // Gán giá trị cho previewTitle
    };

    // Nút upload ảnh
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    // Nút chỉnh sửa ảnh
    const editButton = (
        <div>
            <EditOutlined />
            <div style={{ marginTop: 8 }}>Edit</div>
        </div>
    );


    return (
        <div className="update-product-container">
            {contextHolder}
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : (
                <Card title="Cập nhật sản phẩm" className="update-product-card">
                    <Form form={form} layout="vertical" onFinish={handleUpdate}>
                        <Form.Item
                            name="name"
                            label="Tên sản phẩm"
                            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[
                                { required: true, message: "Vui lòng nhập giá" },
                                { type: 'number', min: 0, message: 'Giá phải là số không âm' },
                            ]}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="category"
                            label="Loại gạo"
                            rules={[{ required: true, message: "Vui lòng chọn loại gạo" }]}
                        >
                            <Select placeholder="Chọn loại gạo">
                                {categories.map((cat) => (
                                    <Option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="information" label="Mô tả">
                            <Input.TextArea rows={4} maxLength={200} showCount />
                        </Form.Item>
                        <Form.Item
                            name="attributes"
                            label="Thuộc tính"
                            rules={[{ required: true, message: "Vui lòng chọn thuộc tính" }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Chọn thuộc tính"
                                options={attributes.map((attr) => ({
                                    label: attr.name,
                                    value: attr.value,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Số lượng"
                            rules={[
                                { required: true, message: "Vui lòng nhập số lượng" },
                                { type: 'number', min: 0, message: 'Số lượng phải là số không âm' },
                            ]}
                        >
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="storeName" label="Cửa hàng">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="storeId" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="zones"
                            label="Khu vực"
                            rules={[{ required: true, message: "Vui lòng chọn khu vực" }]}
                        >
                            <Select mode="multiple" placeholder="Chọn khu vực">
                                {zones.map((z) => (
                                    <Option key={z.id} value={z.id}>
                                        {z.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="productImage"
                            label="Ảnh sản phẩm"
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                beforeUpload={(file) => {
                                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                                    if (!isJpgOrPng) {
                                        messageApi.error('Bạn chỉ có thể tải lên file JPG/PNG!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                    if (!isLt2M) {
                                        messageApi.error('Ảnh phải nhỏ hơn 2MB!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    return true;
                                }}
                                onPreview={handlePreview}
                                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                                maxCount={1}
                            >
                                {fileList.length >= 1 ? editButton : uploadButton}
                            </Upload>
                        </Form.Item>

                        <div className="update-product-actions">
                            <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                Cập nhật
                            </Button>
                            <Button onClick={() => navigate("/store-owner/product")} danger>
                                Hủy
                            </Button>
                        </div>
                    </Form>
                    <Modal
                        visible={previewVisible}
                        title={previewTitle} // Sử dụng previewTitle
                        footer={null}
                        onCancel={() => setPreviewVisible(false)}
                    >
                        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
                    </Modal>
                </Card>
            )}
        </div>
    );
};

export default ProductUpdate;