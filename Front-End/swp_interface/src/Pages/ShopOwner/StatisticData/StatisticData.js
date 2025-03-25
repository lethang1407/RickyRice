import React, { useEffect, useState } from 'react';
import { Table, message, Input, Form, Select, DatePicker, Button, InputNumber, Row, Col } from 'antd';
import qs from 'qs';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import API from '../../../Utils/API/API';
import './style.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;

const typeOptions = [
    { value: 'export', label: 'Xuất Khẩu' },
    { value: 'import', label: 'Nhập Khẩu' }
];

const Statistic = () => {
    const [form] = Form.useForm();
    const token = getToken();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stores, setStores] = useState([]);
    const [fetchingStores, setFetchingStores] = useState(false);
    const [filters, setFilters] = useState({
        store: [],
        totalMoneyMin: null,
        totalMoneyMax: null,
        description: null,
        type: "all",
        createdAtRange: null,
        createdBy: ""
    });
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
        sortField: null,
        sortOrder: null,
    });
    const [searchTimeout, setSearchTimeout] = useState(null);

    const columns = [
        {
            title: 'STT',
            key: 'id',
            render: (_, __, index) => {
                return (tableParams.pagination.current - 1) * tableParams.pagination.pageSize + index + 1;
            },
            width: '4%',
            align: 'center',
        },
        {
            title: 'Mã Thống Kê',
            dataIndex: 'statisticsID',
            key: 'statisticsID',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Tên Cửa Hàng',
            dataIndex: 'storeName',
            key: 'storeName',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Tổng Tiền (VND)',
            dataIndex: 'totalMoney',
            key: 'totalMoney',
            render: (totalMoney) => `${totalMoney.toLocaleString()}`,
            sorter: true,
            width: '15%',
            align: 'center',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Button
                    className={`status-button ${type === true ? 'export' : 'import'}`}
                    type="primary"
                    size="small"
                >
                    {type === true ? 'Xuất Khẩu' : 'Nhập Khẩu'}
                </Button>
            ),
            width: '10%',
            align: 'center',
        },
        {
            title: 'Người Tạo',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
            align: 'center',
            render: (createdAt) => {
                const date = new Date(createdAt);
                return date.toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }
        }
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


    const getStatisticParams = (params) => {
        const { pagination, sortField, sortOrder } = params;
        const { store: store, totalMoneyMin, totalMoneyMax, description, type, createdAtRange, createdBy } = filters;
        return qs.stringify({
            store: store,
            totalMoneyMin,
            totalMoneyMax,
            description,
            type,
            createdAtStart: createdAtRange?.[0]?.format('YYYY-MM-DD'),
            createdAtEnd: createdAtRange?.[1]?.format('YYYY-MM-DD'),
            createdBy,
            page: pagination.current - 1,
            size: pagination.pageSize,
            sortBy: sortField || "createdAt",
            descending: sortOrder === "descend",
        }, { arrayFormat: 'repeat' });
    };

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const queryParams = getStatisticParams(tableParams);
            const response = await getDataWithToken(API.STORE_OWNER.GET_STORE_STATISTICs + '?' + queryParams, token);
            setData(response.content || []);
            setTableParams(prev => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: response.totalElements,
                },
            }));
        } catch (error) {
            message.error('Không thể tải dữ liệu thống kê');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [
        tableParams.pagination.current,
        tableParams.pagination.pageSize,
        tableParams.sortField,
        tableParams.sortOrder,
        filters
    ]);

    const handleTableChange = (pagination, _, sorter) => {
        setTableParams({
            pagination,
            sortField: sorter?.field || null,
            sortOrder: sorter?.order || null,
        });
    };


    const handleInputChange = (changedValues, allValues) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        setSearchTimeout(
            setTimeout(() => {
                handleSearch();
            }, 1000)
        );
        form.setFieldsValue(allValues);
    };


    const handleSearch = () => {
        const values = form.getFieldsValue();
        setFilters({
            store: values.store || [],
            totalMoneyMin: values.totalMoneyMin || null,
            totalMoneyMax: values.totalMoneyMax || null,
            description: values.description || null,
            type: values.type || "all",
            createdAtRange: values.createdAtRange || null,
            createdBy: values.createdBy || ""
        });
        setTableParams(prev => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 }
        }));
    };
    const handleReset = () => {
        form.resetFields();
        setFilters({
            store: [],
            totalMoneyMin: null,
            totalMoneyMax: null,
            description: null,
            type: "all",
            createdAtRange: null,
            createdBy: ""
        });
        setTableParams(prev => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 }
        }));
    };

    return (
        <div className="statistics-list-container">
            <Form
                form={form}
                layout="vertical"
                className="filter-form"
                onValuesChange={handleInputChange}
            >
                <Row gutter={16} className="filter-form-row">
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Cửa Hàng" name="store">
                            <Select
                                mode="multiple"
                                placeholder="Chọn cửa hàng"
                                allowClear
                                loading={fetchingStores}
                                className="filter-form-select"
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
                                placeholder="Tối thiểu"
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                step={1000}
                                className="filter-form-input-number"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Tiền Tối Đa" name="totalMoneyMax">
                            <InputNumber
                                placeholder="Tối đa"
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                step={1000}
                                className="filter-form-input-number"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Loại" name="type">
                            <Select
                                allowClear
                                options={typeOptions}
                                placeholder="Chọn loại"
                                className="filter-form-select"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Người Tạo" name="createdBy">
                            <Input placeholder="Nhập người tạo" className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Khoảng Thời Gian Tạo" name="createdAtRange">
                            <RangePicker style={{ width: '100%' }} className="filter-form-range-picker" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="filter-form-row">
                    <Col span={24} className="filter-form-col" style={{ textAlign: 'right', marginTop: '8px' }}>
                        <Button onClick={handleReset} className="filter-form-reset-button">
                            Làm Mới
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table
                className="statistics-table"
                columns={columns}
                rowKey="statisticsID"
                dataSource={data}
                pagination={{
                    ...tableParams.pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                }}
                loading={loading}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default Statistic;