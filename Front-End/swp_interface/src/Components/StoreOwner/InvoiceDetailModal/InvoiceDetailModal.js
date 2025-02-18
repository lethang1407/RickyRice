import React, { useEffect, useState } from 'react';
import { Modal, Spin, message } from 'antd';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';

const InvoiceDetailModal = ({ visible, invoiceID, onClose }) => {
    const token = getToken();
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState(null);

    // Gọi API lấy chi tiết hóa đơn
    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            setLoading(true);
            try {
                const response = await getDataWithToken(API.STORE_OWNER.GET_INVOICE_DETAIL + '?invoiceId' + invoiceID, token);
                const result = await response.json();
                setDetails(result); // Lưu chi tiết hóa đơn vào state
            } catch (error) {
                message.error('Không thể tải chi tiết hóa đơn');
            } finally {
                setLoading(false);
            }
        };

        if (invoiceID) {
            fetchInvoiceDetails();
        }
    }, [invoiceID]);

    return (
        <Modal
            title="Chi tiết hóa đơn"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            {loading ? (
                <Spin size="large" />
            ) : details ? (
                <div>
                    <p><strong>Mã hóa đơn:</strong> {details.invoiceID}</p>
                    <p><strong>Tên khách hàng:</strong> {details.customerName}</p>
                    <p><strong>Danh sách sản phẩm:</strong></p>
                    <ul>
                        {details.products.map((product, index) => (
                            <li key={index}>{product.name} - {product.quantity} x {product.price}</li>
                        ))}
                    </ul>
                    <p><strong>Tổng tiền:</strong> {details.totalMoney} $</p>
                </div>
            ) : (
                <p>Không tìm thấy chi tiết hóa đơn</p>
            )}
        </Modal>
    );
};

export default InvoiceDetailModal;