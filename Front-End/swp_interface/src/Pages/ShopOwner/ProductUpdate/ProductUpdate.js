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


const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });


const uploadImageAPI = async (url, token, file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.put(url, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });


        if (response.data) {
            return response.data;
        } else {
            throw new Error("Tải ảnh lên thất bại: Không có URL trả về.");
        }
    } catch (err) {
        console.error("Lỗi khi tải ảnh lên (API):", err);
        throw new Error(err.response?.data?.message || "Tải ảnh lên thất bại.");
    }
};


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
    const [productZones, setProductZones] = useState([]);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const UPLOAD_IMAGE_URL = `${API.STORE_OWNER.UPLOAD_PRODUCT_IMAGE}/${productID}`;
    const UPDATE_PRODUCT_URL = `${API.STORE_OWNER.UPDATE_STORE_PRODUCT}/${productID}`;


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const productResponse = await getDataWithToken(`${API.STORE_OWNER.GET_STORE_PRODUCT_DETAIL}?id=${productID}`, token);
                const initialFileList = productResponse.productImage
                    ? [{ uid: '-1', name: 'image.png', status: 'done', url: productResponse.productImage }]
                    : [];
                setFileList(initialFileList);


                setProductZones(productResponse.zones || []);


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
                    storeId ? getDataWithToken(`${API.STORE_OWNER.GET_EMPTY_ZONES}?storeId=${storeId}`, token) : Promise.resolve([])
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




    const handleUpdate = async (values) => {
        setIsSubmitting(true);
        let imageUrl = null;


        try {
            if (fileList.length > 0 && fileList[0].originFileObj) {
                imageUrl = await uploadImageAPI(UPLOAD_IMAGE_URL, token, fileList[0].originFileObj);
                if (!imageUrl) return;
            } else if (fileList.length > 0 && fileList[0].url) {
                imageUrl = fileList[0].url;
            } else {
                imageUrl = "";
            }


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
                const fullZone = zones.find((z) => z.id === zoneId) || productZones.find(z => z.id === zoneId);
                return {
                    id: zoneId,
                    name: fullZone ? fullZone.name : "",
                };
            });


            const product = {
                productID: productID,
                name: values.name,
                price: parseFloat(values.price),
                information: values.information,
                category: categoryObj,
                attributes: attributesArray,
                quantity: parseInt(values.quantity, 10),
                store: storeObj,
                zones: zonesArray,
                productImage: imageUrl,
            };


            await updateProductAPI(UPDATE_PRODUCT_URL, token, product);
            success('Cập nhật sản phẩm thành công!', messageApi);
            setTimeout(() =>
                navigate("/store-owner/product"),
                1000
            )
        } catch (err) {
            error(err.message || "Cập nhật sản phẩm thất bại", messageApi);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };


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
                            <InputNumber style={{ width: '100%' }} step={1000} />
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
                            <InputNumber step={1} />
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
                                {productZones.map((z) => (
                                    <Option key={z.id} value={z.id}>
                                        {z.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="productImage"
                            label="Ảnh sản phẩm"
                            className="avatar-uploader-item"
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
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
                                    return false;
                                }}
                                onPreview={handlePreview}
                                onChange={async ({ file, fileList }) => {
                                    if (file.status === 'removed') {
                                        setFileList([]);
                                        return;
                                    }


                                    try {
                                        const preview = await getBase64(file);
                                        setFileList([{
                                            uid: file.uid,
                                            name: file.name,
                                            status: 'done',
                                            originFileObj: file,
                                            url: preview
                                        }]);
                                    } catch (error) {
                                        messageApi.error('Không thể tải ảnh lên');
                                    }
                                }}
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
                        title={previewTitle}
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



