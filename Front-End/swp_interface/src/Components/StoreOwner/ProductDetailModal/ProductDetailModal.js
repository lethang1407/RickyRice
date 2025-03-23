import React, { useEffect, useState } from "react";
import { Modal, Spin, Card, Image, Descriptions, Tag, List, Button, message } from "antd";
import './style.scss';
import API from "../../../Utils/API/API";
import { getToken } from "../../../Utils/UserInfoUtils";
import { getDataWithToken } from "../../../Utils/FetchUtils";
import rice_default from '../../../assets/img/rice_default.jpg';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { success, error } from '../../../Utils/AntdNotification';

const deleteDataWithToken = async (url, token) => {
    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 || response.status === 204) {
            return { success: true, message: "Xóa thành công" };
        } else {
            return { success: false, message: response.data?.message || "Lỗi khi xóa" };
        }
    } catch (err) {
        console.error("Lỗi khi xóa (API):", err);
        let errorMessage = "Xóa thất bại";
        if (err.response) {
            errorMessage = `Lỗi từ server: ${err.response.status} - ${err.response.data?.message || 'Không có thông báo chi tiết'}`;
        } else if (err.request) {
            errorMessage = "Không thể kết nối đến server";
        } else {
            errorMessage = err.message || "Đã xảy ra lỗi không xác định";
        }

        throw new Error(errorMessage);
    }
};

const ProductDetailModal = ({ visible, productID, onClose, onProductDeleted }) => {
    const token = getToken();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [showConfirmModal, setShowConfirmModal] = useState(false); 

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            try {
                const response = await getDataWithToken(
                    `${API.STORE_OWNER.GET_STORE_PRODUCT_DETAIL}?id=${productID}`,
                    token
                );                
                setProduct(response);
            } catch (err) {
                error("Không thể tải chi tiết sản phẩm", messageApi);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (visible && productID) {
            fetchProductDetail();
        } else {
            setProduct(null);
        }
    }, [visible, productID, token, messageApi]);

    const handleEdit = () => {
        navigate('/store-owner/product/update', { state: { productID, storeId: product.store.id } });
    };

    const handleDelete = async () => {
        try {
            setLoading(true); 
            const response = await deleteDataWithToken(
                `${API.STORE_OWNER.DELETE_STORE_PRODUCT}/${productID}`,
                token
            );

            if (response.success) {
                success(response.message, messageApi);
                onClose();         
                onProductDeleted(); 
            } else {
                error(response.message || "Xóa sản phẩm thất bại", messageApi);
            }
        } catch (err) {
            error(err.message || "Xóa sản phẩm thất bại", messageApi);
        } finally {
            setLoading(false);       
            setShowConfirmModal(false);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false); 
    };

    const openConfirmModal = () => {
        setShowConfirmModal(true); 
    }
    return (
        <Modal
        className="product-detail-modal"
            title="Chi tiết sản phẩm"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="edit" type="primary" onClick={handleEdit}>
                    Chỉnh sửa
                </Button>,
                <Button key="delete" danger onClick={openConfirmModal}>
                    Xóa
                </Button>,
            ]}
            width={800}
        >
            {contextHolder}
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : product ? (
                <div className="product-detail-container">
                    <div className="product-image">
                        <Image
                            width={300}
                            src={product.productImage || rice_default}
                            alt={product.name}
                            style={{ objectFit: "cover" , marginBottom : "30px"}}
                            preview={{
                                mask: <span>Xem ảnh lớn</span>,
                                maskClassName: "custom-preview-mask",
                                scaleStep: 1,
                                maxScale: 10,
                            }}
                        />
                         <Descriptions column={1} bordered>
                            <Descriptions.Item label="Giá">
                                {product.price.toLocaleString()} ₫
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại gạo">
                                {product.category.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng">
                                {product.quantity} kg
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                    <div className="product-info">
                        <Card title={product.name}>
                            <div className="product-attributes">
                                <strong>Thuộc tính:</strong>
                                {product.attributes.map((attr) => (
                                    <Tag key={attr.id} color="blue">{attr.value}</Tag>
                                ))}
                            </div>
                            <div className="product-description">
                                <strong>Mô tả:</strong>
                                <p>{product.information}</p>
                            </div>
                            <div className="store-info">
                                <strong>Cửa hàng:</strong>
                                <List
                                    dataSource={[product.store]}
                                    renderItem={(store) => (
                                        <List.Item>
                                            {store.name}
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <div className="product-zones">
                                <strong>Khu vực:</strong>
                                {product.zones.map((zone) => (
                                    <Tag key={zone.id} color="green">{zone.name}</Tag>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <Modal
                        title="Xác nhận xóa"
                        visible={showConfirmModal}
                        onOk={handleDelete}
                        onCancel={handleCancelDelete}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true, loading: loading}}
                        centered
                    >
                        <p>Bạn có chắc chắn muốn xóa sản phẩm "{product?.name}" không? Hành động này không thể hoàn tác.</p>
                    </Modal>

                </div>
            ) : (
                <p style={{ textAlign: "center" }}>Không tìm thấy sản phẩm</p>
            )}
        </Modal>
    );
};

export default ProductDetailModal;