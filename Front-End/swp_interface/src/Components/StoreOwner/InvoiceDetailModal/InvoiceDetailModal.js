import React, { useEffect, useState, useRef } from "react";
import { Modal, Spin, message, Table, Button } from "antd";
import API from "../../../Utils/API/API";
import { getToken } from "../../../Utils/UserInfoUtils";
import { getDataWithToken } from "../../../Utils/FetchUtils";

const InvoiceDetailModal = ({ visible, invoiceID, shipMoney, totalMoney, customerName, customerPhoneNumber, onClose }) => {
    const token = getToken();
    const [loading, setLoading] = useState(false);
    const [productDetails, setProductDetails] = useState([]);
    const printRef = useRef();

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            setLoading(true);
            try {
                const response = await getDataWithToken(
                    `${API.STORE_OWNER.GET_INVOICE_DETAIL}?invoiceId=${invoiceID}`,
                    token
                );
                setProductDetails(response);
            } catch (error) {
                message.error("Không thể tải chi tiết hóa đơn");
            } finally {
                setLoading(false);
            }
        };

        if (invoiceID) fetchInvoiceDetails();
    }, [invoiceID, token]);

    const calculateProductTotal = (quantity, price, discount = 0) => {
        const total = quantity * price;
        const discountAmount = (total * discount) / 100;
        return total - discountAmount;
    };

    const totalProductCost = productDetails.reduce((sum, product) => {
        return (
            sum +
            calculateProductTotal(
                product.quantity,
                product.productPrice,
                product.discount
            )
        );
    }, 0);

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
    
        // Tạo iframe ẩn
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "none";
        document.body.appendChild(iframe);
    
        // Ghi nội dung vào iframe
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        @media print {
                            @page { margin: 0; } /* Loại bỏ margin của trang in */
                            body { margin: 10mm; } /* Định dạng lề */
                        }
                    </style>
                </head>
                <body>
                    ${printContents}
                </body>
            </html>
        `);
        doc.close();
        iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
    };
    
    

    return (
        <Modal
            title={`Chi tiết hóa đơn`}
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="print" onClick={handlePrint}>
                    In hóa đơn
                </Button>,
                
            ]}
            width={800}
        >
            {loading ? (
                <Spin size="large" />
            ) : productDetails.length > 0 ? (
                <div ref={printRef}>
                    {/* Invoice Header */}
                    <div className="header-detail" style={{ marginBottom: "20px" }}>
                        <p style={{ margin: "0", fontSize: "16px" }}>
                            <p>Mã hóa đơn: {invoiceID}</p>
                            <p>Tên khách hàng: {customerName}</p>
                            <p>SĐT khách hàng: {customerPhoneNumber}</p>
                        </p>
                    </div>

                    {/* Invoice Product Table */}
                    <Table
                        dataSource={productDetails}
                        rowKey="invoiceDetailID"
                        pagination={false}
                        bordered
                        style={{ marginBottom: "20px" }}
                    >
                        <Table.Column
                            title="Tên sản phẩm"
                            dataIndex="productName"
                            key="productName"
                        />
                        <Table.Column
                            title="Số lượng"
                            dataIndex="quantity"
                            key="quantity"
                        />
                        <Table.Column
                            title="Giá sản phẩm (₫)"
                            dataIndex="productPrice"
                            key="productPrice"
                            render={(price) => price.toLocaleString()}
                        />
                        <Table.Column
                            title="Giảm giá (%)"
                            dataIndex="discount"
                            key="discount"
                            render={(discount) => discount || 0}
                        />
                        <Table.Column
                            title="Thành tiền (₫)"
                            key="total"
                            render={(product) =>
                                calculateProductTotal(
                                    product.quantity,
                                    product.productPrice,
                                    product.discount
                                ).toLocaleString()
                            }
                        />
                    </Table>

                    {/* Invoice Footer */}
                    <div className="footer-detail" style={{ textAlign: "right", marginTop: "20px" }}>
                        <p style={{ margin: "0", fontSize: "16px" }}>
                            <strong>Tổng tiền sản phẩm:</strong> {totalProductCost.toLocaleString()} ₫
                        </p>
                        <p style={{ margin: "0", fontSize: "16px" }}>
                            <strong>Tổng tiền vận chuyển:</strong> {shipMoney.toLocaleString()} ₫
                        </p>
                        <br></br>
                        <p style={{ margin: "0", fontSize: "16px" }}>
                            <strong>Tổng tiền hóa đơn:</strong> {totalMoney.toLocaleString()} ₫
                        </p>
                    </div>
                </div>
            ) : (
                <p>Không tìm thấy chi tiết hóa đơn</p>
            )}
        </Modal>
    );
};

export default InvoiceDetailModal;