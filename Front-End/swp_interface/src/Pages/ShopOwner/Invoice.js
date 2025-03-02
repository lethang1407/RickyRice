import React, { useEffect, useState } from 'react';
import { Table, message, Input } from 'antd';
import qs from 'qs';
import InvoiceDetailModal from '../../Components/StoreOwner/InvoiceDetailModal/InvoiceDetailModal';
import { getToken } from '../../Utils/UserInfoUtils';
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
        filters: {},
        sortField: null,
        sortOrder: null,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoiceID, setSelectedInvoiceID] = useState(null);

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (_, __, index) => {
                const id =
                    (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
                    index + 1;
                return id;
            },
            width: '5%',
        },
        {
            title: 'Invoice Number',
            dataIndex: 'invoiceID',
            key: 'invoiceID',
            width: '5%',
        },
        {
            title: 'Customer Details',
            key: 'customerDetails',
            render: (_, record) => (
                <>
                    <div><strong>Name:</strong> {record.customerName}</div>
                    <div><strong>Phone:</strong> {record.customerPhoneNumber}</div>
                </>
            ),
            width: '15%',
        },
        {
            title: 'Store Name',
            dataIndex: 'storeName',
            key: 'storeName',
            width: '10%',
        },
        {
            title: 'Product Money',
            dataIndex: 'productMoney',
            key: 'productMoney',
            sorter: true,
            render: (productMoney) => `${(productMoney || 0).toLocaleString()} đ`,
            width: '13%',
        },
        {
            title: 'Ship Money',
            dataIndex: 'shipMoney',
            key: 'shipMoney',
            sorter: true,
            render: (shipMoney) => `${(shipMoney || 0).toLocaleString()} đ`,
            width: '12%',
        },
        {
            title: 'Total Money',
            key: 'totalMoney',
            dataIndex: 'totalMoney',
            render: (totalMoney) => `${(totalMoney || 0).toLocaleString()} đ`,
            sorter: true,
            width: '8%',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: [
                { text: 'Xuất Khẩu', value: true },
                { text: 'Nhập Khẩu', value: false }
            ],
            filterMultiple: false, 
            onFilter: (value, record) => record.type === value, 
            render: (type) => (
                <span style={{ color: type ? 'green' : 'red' }}>
                    {type ? 'Xuất Khẩu' : 'Nhập Khẩu'}
                </span>
            ),
            width: '8%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Paid', value: true },
                { text: 'Unpaid', value: false }
            ],
            filterMultiple: false, 
            onFilter: (value, record) => record.type === value, 
            render: (status) => (
                <span style={{ color: status ? 'green' : 'red' }}>
                    {status ? 'Paid' : 'Unpaid'}
                </span>
            ),
            width: '8%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
        },
    ];

    const getInvoiceParam = (params) => {
        const { pagination, sortField, sortOrder, filters } = params;
        const typeFilter =
            filters?.type?.[0] === true
                ? "export"
                : filters?.type?.[0] === false
                    ? "import"
                    : "all";
        const statusFilter =
            filters?.status?.[0] === true
                ? "paid"
                : filters?.status?.[0] === false
                    ? "unpaid"
                    : "all";
        return qs.stringify({
            page: pagination.current - 1,
            size: pagination.pageSize,
            sortBy: sortField ,
            descending: sortOrder === "descend",
            type: typeFilter,
            status: statusFilter,
        });
    };

    const fetchInvoice = async () => {
        setLoading(true);
        try {
            const queryParams = `?phoneNumber=${encodeURIComponent(searchValue)}&` + getInvoiceParam(tableParams);
            const response = await getDataWithToken(API.STORE_OWNER.GET_INVOICES + queryParams, token);
            setData(response.content);
            setTableParams((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: response.totalElements,
                },
            }));
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
        tableParams.filters,
        searchValue
    ]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters: {
                type: filters.type || [],
                status: filters.status || [],
            },
            sortField: sorter?.field || null,
            sortOrder: sorter?.order || null
        });
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const newTimeoutId = setTimeout(() => {
            setSearchValue(value);
            setTableParams((prev) => ({
                ...prev,
                pagination: { ...prev.pagination, current: 1 },
            }));
        }, 1000);
        setTimeoutId(newTimeoutId);
    };

    const onRowClick = (record) => {
        setSelectedInvoiceID(record.invoiceID);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInvoiceID(null);
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
                    style: { cursor: 'pointer' },
                })}
            />

            {isModalOpen && (
                <InvoiceDetailModal
                    visible={isModalOpen}
                    invoiceID={selectedInvoiceID}
                    shipMoney={
                        data.find(invoice => invoice.invoiceID === selectedInvoiceID)?.shipMoney || 0
                    }
                    totalMoney={
                        data.find(invoice => invoice.invoiceID === selectedInvoiceID)?.totalMoney || 0
                    }
                    customerName={
                        data.find(invoice => invoice.invoiceID === selectedInvoiceID)?.customerName || 0
                    }
                    customerPhoneNumber={
                        data.find(invoice => invoice.invoiceID === selectedInvoiceID)?.customerPhoneNumber || 0
                    }
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default Invoice;
