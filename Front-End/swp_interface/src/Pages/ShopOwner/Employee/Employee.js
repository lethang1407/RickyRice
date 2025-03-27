import React, { useEffect, useState } from 'react';
import { Table, message, Input, Form, Select, Row, Col, Button, Avatar } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import qs from 'qs';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import API from '../../../Utils/API/API';
import './style.scss';
import EmployeeDetailModal from '../../../Components/StoreOwner/EmployeeDetailModal/EmployeeDetailModal';
import AddEmployeeModal from '../../../Components/StoreOwner/AddEmployeeModal';

const { Option } = Select;

const Employee = () => {
    const [form] = Form.useForm();
    const token = getToken();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        store: [],
        gender: 'all',
    });
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
            total: 0,
        },
        filters: {},
        sortField: null,
        sortOrder: null,
    });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEmployeeID, setSelectedEmployeeID] = useState(null);
    const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [stores, setStores] = useState([]);
    const [fetchingStores, setFetchingStores] = useState(false);

    const columns = [
        {
            title: 'STT',
            key: 'id',
            render: (_, __, index) => {
                const id =
                    (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
                    index + 1;
                return id;
            },
            width: '5%',
            align: 'center'
        },
        {
            title: 'Thông Tin Nhân Viên',
            key: 'employeeDetails',
            render: (_, record) => (
                <>
                    <span>
                        <div><strong>Tên:</strong> {record.storeAccount?.name || 'N/A'}</div>
                        <div><strong>Email:</strong> {record.storeAccount?.email || 'N/A'}</div>
                    </span>
                </>
            ),
            width: '20%',
        },
        {
            title: 'Tên Cửa Hàng',
            dataIndex: 'storeInfo',
            key: 'storeInfo',
            render: (storeInfo) => storeInfo?.storeName || 'N/A',
            width: '15%',
            align: 'center'
        },
        {
            title: 'Giới Tính',
            dataIndex: 'storeAccount',
            key: 'gender',
            render: (storeAccount) => storeAccount?.gender != null ? (
                <Button
                    className={`gender-button ${storeAccount.gender === true ? 'male' : 'female'}`}
                    type="primary"
                    size="small"
                >
                    {storeAccount.gender === true ? 'Nam' : 'Nữ'}
                </Button>
            ) : 'N/A',
            width: '10%',
            align: 'center'
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'storeAccount',
            key: 'phoneNumber',
            render: (storeAccount) => storeAccount?.phoneNumber || 'N/A',
            width: '15%',
            align: 'center'
        },
        {
            title: 'Thông Tin Tài Khoản',
            dataIndex: 'storeAccount',
            key: 'accountInfo',
            render: (storeAccount) => (
                <>
                    <div><strong>Tên Đăng Nhập:</strong> {storeAccount?.username || 'N/A'}</div>
                </>
            ),
            width: '25%',
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
                } else if (response && Array.isArray(response.data)) {
                    const cleanedStores = response.data
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
                message.error(`Không thể tải dữ liệu cửa hàng: ${error.message}`);
                setStores([]);
            } finally {
                setFetchingStores(false);
            }
        };
        if (token) {
            fetchStores();
        }
    }, [token]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const genderFilterValue = filters.gender === 'all' ? null : filters.gender;

            const queryParams = qs.stringify(
                {
                    name: filters.name || null,
                    email: filters.email || null,
                    phoneNumber: filters.phoneNumber || null,
                    storeIds: filters.store,
                    gender: genderFilterValue,
                    page: tableParams.pagination.current - 1,
                    size: tableParams.pagination.pageSize,
                    sortBy: tableParams.sortField || 'createdAt',
                    sortOrder: tableParams.sortOrder ? (tableParams.sortOrder === "descend" ? 'desc' : 'asc') : null,
                },
                {
                    arrayFormat: 'repeat',
                    encode: false,
                    skipNulls: true
                }
            );

            const response = await getDataWithToken(`${API.STORE_OWNER.GET_STORE_EMPLOYEES}?${queryParams}`, token);

            const employees = response?.content || response?.data?.content || (Array.isArray(response) ? response : []);
            const total = response?.totalElements ?? response?.data?.totalElements ?? 0;

            if (Array.isArray(employees)) {
                setData(employees);
                setTableParams((prev) => ({
                    ...prev,
                    pagination: {
                        ...prev.pagination,
                        total: total,
                    },
                }));
            } else {
                message.error('Lỗi định dạng dữ liệu nhân viên');
                setData([]);
                setTableParams((prev) => ({
                    ...prev,
                    pagination: {
                        ...prev.pagination,
                        total: 0,
                        current: 1,
                    },
                }));
            }
        } catch (error) {
            message.error(`Không thể tải danh sách nhân viên: ${error.message}`);
            setData([]);
            setTableParams((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: 0,
                    current: 1,
                },
            }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchEmployees();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        token,
        tableParams.pagination.current,
        tableParams.pagination.pageSize,
        tableParams.sortField,
        tableParams.sortOrder,
        filters.name,
        filters.email,
        filters.phoneNumber,
        filters.gender,
        JSON.stringify(filters.store)
    ]);

    const handleTableChange = (pagination, _, sorter) => {
        setTableParams({
            pagination,
            filters: {},
            sortField: sorter.field,
            sortOrder: sorter.order,
        });
    };

    const handleInputChange = (changedValues, allValues) => {
        if (changedValues.hasOwnProperty('name') || changedValues.hasOwnProperty('email') || changedValues.hasOwnProperty('phoneNumber')) {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            setSearchTimeout(
                setTimeout(() => {
                    setFilters(prev => ({ ...prev, ...allValues }));
                    setTableParams(prev => ({ ...prev, pagination: { ...prev.pagination, current: 1 } }));
                }, 500)
            );
        } else {
            if (searchTimeout) clearTimeout(searchTimeout);
            setFilters(prev => ({ ...prev, ...allValues }));
            setTableParams(prev => ({ ...prev, pagination: { ...prev.pagination, current: 1 } }));
        }
    };

    const handleReset = () => {
        form.resetFields();
        const defaultFilters = {
            name: '',
            email: '',
            phoneNumber: '',
            store: [],
            gender: 'all',
        };
        setFilters(defaultFilters);
        setTableParams((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
            sortField: null,
            sortOrder: null,
        }));
    };

    const onRowClick = (record) => {
        const idField = record.id || record.employeeID;
        setSelectedEmployeeID(idField);
        setSelectedEmployeeDetails(record);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedEmployeeID(null);
        setSelectedEmployeeDetails(null);
    };

    const showAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleAddModalClose = () => {
        setIsAddModalOpen(false);
    };

    const handleEmployeeAdded = () => {
        fetchEmployees();
    };

    const handleEmployeeDeleted = () => {
        fetchEmployees();
    };

    return (
        <div className="employee-list-container">
            <Form
                form={form}
                layout="vertical"
                className="filter-form"
                onValuesChange={handleInputChange}
                initialValues={filters}
            >
                <Row gutter={16} className="filter-form-row">
                    <Col xs={24} sm={12} md={8} lg={5} className="filter-form-col">
                        <Form.Item label="Tên" name="name">
                            <Input placeholder="Nhập tên" allowClear className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={5} className="filter-form-col">
                        <Form.Item label="Email" name="email">
                            <Input placeholder="Nhập email" allowClear className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={5} className="filter-form-col">
                        <Form.Item label="Số Điện Thoại" name="phoneNumber">
                            <Input placeholder="Nhập SĐT" allowClear className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} className="filter-form-col">
                        <Form.Item label="Cửa Hàng" name="store">
                            <Select
                                mode="multiple"
                                placeholder="Chọn cửa hàng"
                                allowClear
                                loading={fetchingStores}
                                className="filter-form-select"
                                maxTagCount="responsive"
                            >
                                {stores.map((store) => (
                                    <Option key={store.storeID} value={store.storeID}>
                                        {store.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={3} className="filter-form-col">
                        <Form.Item label="Giới Tính" name="gender">
                            <Select placeholder="Chọn giới tính" allowClear className="filter-form-select">
                                <Option value="all">Tất cả</Option>
                                <Option value="true">Nam</Option>
                                <Option value="false">Nữ</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} justify="end" className="filter-form-row filter-actions-row">
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showAddModal}
                            className="add-employee-button"
                        >
                            Thêm Nhân Viên
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={handleReset} className="filter-form-reset-button">
                            Làm Mới
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table
                className="employee-table"
                columns={columns}
                rowKey={(record) => record.id || record.employeeID || record.key}
                dataSource={data}
                pagination={{
                    ...tableParams.pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhân viên`,
                }}
                loading={loading}
                onChange={handleTableChange}
                onRow={(record) => ({
                    onClick: () => onRowClick(record),
                    style: { cursor: 'pointer' },
                })}
                scroll={{ x: 'max-content' }}
            />

            {isDetailModalOpen && (
                <EmployeeDetailModal
                    visible={isDetailModalOpen}
                    employeeID={selectedEmployeeID}
                    employeeDetails={selectedEmployeeDetails}
                    onClose={closeDetailModal}
                    onEmployeeDeleted={handleEmployeeDeleted}
                    stores={stores}
                />
            )}

            {isAddModalOpen && (
                <AddEmployeeModal
                    visible={isAddModalOpen}
                    onClose={handleAddModalClose}
                    onSuccess={handleEmployeeAdded}
                    stores={stores}
                    token={token}
                />
            )}
        </div>
    );
};

export default Employee;