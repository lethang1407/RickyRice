import React, { useEffect, useState } from "react";
import { Modal, Spin, message, Card, Image, Descriptions, Tag, List } from "antd";
import './style.scss';

import { getToken } from "../../../Utils/UserInfoUtils";
import { getDataWithToken } from "../../../Utils/FetchUtils";

const ProductDetailModal = ({ visible, productID, onClose }) => {
    const token = getToken();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            try {
                const response = await getDataWithToken(
                    `/store-owner/product-detail?productId=${productID}`,
                    token
                );
                setProduct(response);
            } catch (error) {
                message.error("Không thể tải chi tiết sản phẩm");
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
    }, [visible, productID, token]);

    return (
        <Modal
            title="Chi tiết sản phẩm"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : product ? (
                <div className="product-detail-container">
                    <div className="product-image">
                        <Image
                            width={300}
                            src={product.productImage}
                            alt={product.name}
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                    <div className="product-info">
                        <Card title={product.name}>
                            <Descriptions column={1} bordered>
                                <Descriptions.Item label="Giá">
                                    {product.price.toLocaleString()} ₫
                                </Descriptions.Item>
                                <Descriptions.Item label="Danh mục">
                                    {product.categoryName}
                                </Descriptions.Item>
                            </Descriptions>
                            <div className="product-attributes">
                                <strong>Thuộc tính:</strong>
                                {product.storeProductAttribute.map((attr, index) => (
                                    <Tag key={index} color="blue">{attr}</Tag>
                                ))}
                            </div>
                            <div className="product-description">
                                <strong>Mô tả:</strong>
                                <p>{product.information}</p>
                            </div>
                            <div className="store-info">
                                <strong>Cửa hàng:</strong>
                                <List
                                    dataSource={product.storeName}
                                    renderItem={(store, index) => (
                                        <List.Item>
                                            {store} - {product.storeZone[index]}
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <p style={{ textAlign: "center" }}>Không tìm thấy sản phẩm</p>
            )}
        </Modal>
    );
};

export default ProductDetailModal;