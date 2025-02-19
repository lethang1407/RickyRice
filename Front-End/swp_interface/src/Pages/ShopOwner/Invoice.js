import React, { useEffect, useState } from 'react';
import { Table, message, Input, Modal, Spin } from 'antd';
import qs from 'qs';
import Loading from '../Loading/Loading';
import InvoiceDetailModal from '../../Components/StoreOwner/InvoiceDetailModal/InvoiceDetailModal';
import {getToken} from '../../Utils/UserInfoUtils'
import { getDataWithToken } from '../../Utils/FetchUtils';
import API from '../../Utils/API/API';

const { Search } = Input;

const Invoice = () => {
    const token = getToken();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [timeoutId, setTimeoutId] = useState(null);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoiceID, setSelectedInvoiceID] = useState(null); // ID của invoice được chọn

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (_, __, index) => {
                const id =
                    (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
                    index +
                    1;
                return id;
            },
            width: '5%',
        },
        {
            title: 'Invoice Number',
            dataIndex: 'invoiceID',
            key: 'invoiceID',
            width: '15%',
        },
        {
            title: 'Customer Details',
            key: 'customerDetails',
            render: (_, record) => {
                return (
                    <>
                        <div><strong>Name:</strong> {record.customerFullName}</div>
                        <div><strong>Phone:</strong> {record.customerPhoneNumber}</div>
                    </>
                );
            },
            width: '20%',
        },
        {
            title: 'Store Name',
            dataIndex: 'storeName',
            key: 'storeName',
            width: '15%',
        },
        {
            title: 'Product Money',
            dataIndex: 'productMoney',
            key: 'productMoney',
            sorter: true,
            render: (productMoney) => `${(productMoney || 0).toLocaleString()} $`,
            width: '12%',
        },
        {
            title: 'Ship Money',
            dataIndex: 'shipMoney',
            key: 'shipMoney',
            sorter: true,
            render: (shipMoney) => `${(shipMoney || 0).toLocaleString()} $`,
            width: '12%',
        },
        {
            title: 'Total Money',
            key: 'totalMoney',
            dataIndex: 'totalMoney',
            render: (_, record) => {
                const totalMoney = (record.productMoney || 0) + (record.shipMoney || 0);
                return `${totalMoney.toLocaleString()} $`;
            },
            width: '15%',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (type ? 'Online' : 'Offline'),
            width: '10%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            render: (status) => (
                <span
                    style={{
                        color: status ? 'green' : 'red',
                        fontWeight: 'bold',
                    }}
                >
                    {status ? 'Paid' : 'Unpaid'}
                </span>
            ),
            width: '10%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '15%',
        },
    ];

    const getInvoiceParam = (params) => {
        const { pagination, sortField, sortOrder } = params;
        return qs.stringify({
            page: pagination.current - 1,
            size: pagination.pageSize,
            sortBy: sortField,
            descending: sortOrder === 'descend',
        });
    };

    const fetchInvoice = async () => {
        setLoading(true);
        try {
            const queryParams = `?phoneNumber=${encodeURIComponent(searchValue)}&` + getInvoiceParam(tableParams);
            const response = await getDataWithToken(API.STORE_OWNER.GET_INVOICES + queryParams, token);

            setData(response.content);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: response.totalElements,
                },
            });
        } catch (error) {
            message.error('Không thể tải dữ liệu danh sách invoices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [
        tableParams.pagination.current,
        tableParams.pagination.pageSize,
        tableParams.sortField,
        tableParams.sortOrder,
        searchValue,
    ]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortField: sorter.field,
            sortOrder: sorter.order,
        });
    };

    const handleSearch = (e) => {
        const value = e.target.value;

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = setTimeout(() => {
            setSearchValue(value);
            setTableParams({
                ...tableParams,
                pagination: { current: 1, pageSize: tableParams.pagination.pageSize },
            });
        }, 1000);

        setTimeoutId(newTimeoutId);
    };

    const onRowClick = (record) => {
        setSelectedInvoiceID(record.invoiceID); // Lưu ID của invoice được chọn
        setIsModalOpen(true); // Mở Modal
    };

    // Hàm đóng Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInvoiceID(null); // Xóa ID của invoice sau khi đóng
    };

    return (
        <div>
            <Search
                placeholder="Enter Phone Number"
                onChange={handleSearch}
                enterButton
                style={{ marginBottom: 16 }}
                loading={loading}
            />
            <Table
                columns={columns}
                rowKey="invoiceID"
                dataSource={data}
                pagination={{
                    ...tableParams.pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['1', '2', '3', '4', '5'],
                }}
                loading={loading}
                onChange={handleTableChange}
                onRow={(record) => ({
                    onClick: () => onRowClick(record),
                    style: { cursor: 'pointer' }, // Thay đổi con trỏ chuột
                })}
            />

            {/* Component Modal hiển thị chi tiết hóa đơn */}
            {isModalOpen && (
                <InvoiceDetailModal
                    visible={isModalOpen}
                    invoiceID={selectedInvoiceID}
                    onClose={closeModal} // Truyền callback đóng modal
                />
            )}

        </div>
    );
};

export default Invoice;