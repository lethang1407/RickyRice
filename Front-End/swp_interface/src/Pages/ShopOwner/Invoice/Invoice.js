import React, { useEffect, useState } from 'react';
import { Table, message, Input, Form, Select, Row, Col, Button, InputNumber } from 'antd';
import qs from 'qs';
import InvoiceDetailModal from '../../../Components/StoreOwner/InvoiceDetailModal/InvoiceDetailModal';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import API from '../../../Utils/API/API';
import './style.scss';

const { Option } = Select;

const Invoice = () => {
    const [form] = Form.useForm();
    const token = getToken();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stores, setStores] = useState([]);
    const [fetchingStores, setFetchingStores] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
        filters: {},
        sortField: null,
        sortOrder: null,
    });
    const [filters, setFilters] = useState({
        phoneNumber: '',
        invoiceNumber: '',
        store: [],
        totalMoneyMin: null,
        totalMoneyMax: null,
        type: null,
        status: null
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoiceID, setSelectedInvoiceID] = useState(null);

    const columns = [
        {
            title: 'STT',
            key: 'id',
            render: (_, __, index) => {
                return (tableParams.pagination.current - 1) * tableParams.pagination.pageSize + index + 1;
            },
            width: '5%',
            align: 'center',
        },
        {
            title: 'Mã HĐ',
            dataIndex: 'invoiceID',
            key: 'invoiceID',
            width: '6%',
            align: 'center',
        },
        {
            title: 'Chi Tiết Khách Hàng',
            key: 'customerDetails',
            render: (_, record) => (
                <>
                    <div><strong>Tên:</strong> {record.customerName}</div>
                    <div><strong>SĐT:</strong> {record.customerPhoneNumber}</div>
                </>
            ),
            width: '15%',
            align: 'center',
        },
        {
            title: 'Tên Cửa Hàng',
            dataIndex: 'storeName',
            key: 'storeName',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Tiền Hàng (VNĐ)',
            dataIndex: 'productMoney',
            key: 'productMoney',
            sorter: true,
            render: (productMoney) => `${(productMoney || 0).toLocaleString()}`,
            width: '10%',
            align: 'center',
        },
        {
            title: 'Tiền Ship (VNĐ)',
            dataIndex: 'shipMoney',
            key: 'shipMoney',
            sorter: true,
            render: (shipMoney) => `${(shipMoney || 0).toLocaleString()}`,
            width: '10%',
            align: 'center',
        },
        {
            title: 'Tổng Tiền (VNĐ)',
            key: 'totalMoney',
            dataIndex: 'totalMoney',
            render: (totalMoney) => `${(totalMoney || 0).toLocaleString()}`,
            width: '10%',
            align: 'center',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: '9%',
            align: 'center',
            render: (type) => (
                <Button
                    className={`status-button ${type === true ? 'export' : 'import'}`}
                    type="primary"
                    size="small"
                >
                    {type === true ? 'Xuất' : 'Nhập'}
                </Button>
            ),
        },
        {
            title: 'Mô Tả',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
            align: 'center',
        },
    ];

    useEffect(() => {
        const fetchStores = async () => {
            setFetchingStores(true);
            try {
                const response = await getDataWithToken(API.STORE_OWNER.GET_ALL_STORES, token);
                if (Array.isArray(response)) {
                    const cleanedStores = response
                        .filter(store => store.id != null)
                        .map((store) => ({
                            ...store,
                            storeID: store.id,
                        }));
                    setStores(cleanedStores);
                } else {
                    message.error('Lỗi định dạng dữ liệu cửa hàng');
                    setStores([]);
                }
            } catch (error) {
                message.error('Không thể tải dữ liệu cửa hàng.');
                setStores([]);
            } finally {
                setFetchingStores(false);
            }
        };
        fetchStores();
    }, [token]);

    const getInvoiceParam = () => {
        const { pagination, sortField, sortOrder } = tableParams;
        return qs.stringify({
            phoneNumber: filters.phoneNumber,
            invoiceNumber: filters.invoiceNumber,
            store: filters.store,
            totalMoneyMin: filters.totalMoneyMin,
            totalMoneyMax: filters.totalMoneyMax,
            type: filters.type || 'all',
            status: filters.status || 'all',
            page: pagination.current - 1,
            size: pagination.pageSize,
            sortBy: sortField,
            descending: sortOrder === "descend",
        }, { arrayFormat: 'repeat' });
    };

    const fetchInvoice = async () => {
        setLoading(true);
        try {
            const queryParams = getInvoiceParam();
            console.log(queryParams);

            const response = await getDataWithToken(API.STORE_OWNER.GET_INVOICES + '?' + queryParams, token);
            if (response && response.content) {
                setData(response.content);
            }
            else {
                setData([])
            }
            setTableParams((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: response.totalElements,
                },
            }));
        } catch (error) {
            message.error('Không thể tải dữ liệu hóa đơn');
            setData([]);
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
        filters
    ]);

    const handleInputChange = (changedValues, allValues) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        setSearchTimeout(
            setTimeout(() => {
                handleSearch(allValues);
            }, 1000)
        );
    };

    const handleSearch = (values = form.getFieldsValue()) => {
        setFilters({
            phoneNumber: values.phoneNumber || '',
            invoiceNumber: values.invoiceNumber || '',
            store: values.store || [],
            totalMoneyMin: values.totalMoneyMin || null,
            totalMoneyMax: values.totalMoneyMax || null,
            type: values.type || null,
            status: values.status || null
        });
        setTableParams((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const handleReset = () => {
        form.resetFields();
        setFilters({
            phoneNumber: '',
            invoiceNumber: '',
            store: [],
            totalMoneyMin: null,
            totalMoneyMax: null,
            type: null,
            status: null
        });
        setTableParams((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const handleTableChange = (pagination, _, sorter) => {
        setTableParams({
            pagination,
            sortField: sorter?.field || null,
            sortOrder: sorter?.order || null,
        });
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
        <div className="invoice-list-container">
            <Form
                form={form}
                layout="vertical"
                className="filter-form"
                onValuesChange={handleInputChange}
            >
                <Row gutter={16} className="filter-form-row">
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Mã Hóa Đơn" name="invoiceNumber">
                            <Input placeholder="Nhập mã hóa đơn" className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Số Điện Thoại" name="phoneNumber">
                            <Input placeholder="Nhập số điện thoại" className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Cửa Hàng" name="store">
                            <Select
                                className="filter-form-select"
                                mode="multiple"
                                placeholder="Chọn cửa hàng"
                                allowClear
                                loading={fetchingStores}
                            >
                                {stores.map((store) => (
                                    <Option key={store.storeID} value={store.storeID}>
                                        {store.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Tiền Tối Thiểu" name="totalMoneyMin">
                            <InputNumber
                                className="filter-form-input-number"
                                placeholder="Tối thiểu"
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                step={1000}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Tiền Tối Đa" name="totalMoneyMax">
                            <InputNumber
                                className="filter-form-input-number"
                                placeholder="Tối đa"
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                step={1000}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Loại" name="type">
                            <Select
                                className="filter-form-select"
                                placeholder="Chọn loại"
                                allowClear
                            >
                                <Option value="export">Xuất</Option>
                                <Option value="import">Nhập</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Trạng Thái" name="status">
                            <Select
                                className="filter-form-select"
                                placeholder="Chọn trạng thái"
                                allowClear
                            >
                                <Option value="paid">Đã Thanh Toán</Option>
                                <Option value="unpaid">Nợ</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right', marginBottom: '16px' }}>
                        <Button onClick={handleReset} style={{ marginRight: '8px' }}>
                            Làm Mới
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table
                className="invoice-table"
                columns={columns}
                rowKey="invoiceID"
                dataSource={data}
                pagination={{
                    ...tableParams.pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
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
                    shipMoney={data.find(invoice => invoice.invoiceID === selectedInvoiceID)?.shipMoney || 0}
                    totalMoney={data.find(invoice => invoice.invoiceID === selectedInvoiceID)?.totalMoney || 0}
                    customerName={data.find(invoice => invoice.invoiceID === selectedInvoiceID)?.customerName || ''}
                    customerPhoneNumber={data.find(invoice => invoice.invoiceID === selectedInvoiceID)?.customerPhoneNumber || ''}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default Invoice;