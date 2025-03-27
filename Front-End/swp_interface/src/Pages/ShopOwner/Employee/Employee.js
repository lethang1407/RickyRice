import React, { useEffect, useState } from 'react';
import { Table, message, Input, Form, Select, Row, Col, Button } from 'antd';
import qs from 'qs';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import API from '../../../Utils/API/API';
import './style.scss'
import EmployeeDetailModal from '../../../Components/StoreOwner/EmployeeDetailModal/EmployeeDetailModal';

const { Option } = Select;

const Employee = () => {
    const [form] = Form.useForm();
    const token = getToken();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        employeeID: '',
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
        },
        filters: {},
        sortField: null,
        sortOrder: null,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                    <div><strong>Tên:</strong> {record.storeAccount?.name || 'N/A'}</div>
                    <div><strong>Email:</strong> {record.storeAccount?.email || 'N/A'}</div>
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
            render: (storeAccount) => (
                <Button
                    className={`gender-button ${storeAccount?.gender === true ? 'male' : 'female'}`}
                    type="primary"
                    size="small"
                >
                    {storeAccount?.gender === true ? 'Nam' : 'Nữ'}
                </Button>
            ),
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
                    <div><strong>SĐT:</strong> {storeAccount?.phoneNumber || 'N/A'}</div>
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

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const queryParams = qs.stringify(
                {
                    employeeID: filters.employeeID,
                    name: filters.name,
                    email: filters.email,
                    phoneNumber: filters.phoneNumber,
                    store: filters.store,
                    gender: filters.gender,
                    page: tableParams.pagination.current - 1,
                    size: tableParams.pagination.pageSize,
                    sortBy: tableParams.sortField || 'createdAt',
                    descending: tableParams.sortOrder === "descend",
                },
                { arrayFormat: 'repeat', encode: true }
            );

            const response = await getDataWithToken(`${API.STORE_OWNER.GET_STORE_EMPLOYEES}?${queryParams}`, token);
            console.log(response);
            
            if (Array.isArray(response.content)) {
                setData(response.content);
            } else {
                message.error('Lỗi định dạng dữ liệu nhân viên');
                setData([]);
            }
            setTableParams((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: response.totalElements,
                },
            }));
        } catch (error) {
            message.error('Không thể tải dữ liệu danh sách nhân viên');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [
        tableParams.pagination.current,
        tableParams.pagination.pageSize,
        tableParams.sortField,
        tableParams.sortOrder,
        filters.employeeID,
        filters.name,
        filters.email,
        filters.phoneNumber,
        filters.gender,
        JSON.stringify(filters.store)
    ]);

    const handleTableChange = (pagination, _, sorter) => {
        setTableParams({
            pagination,
            sortField: sorter?.field || null,
            sortOrder: sorter?.order || null,
        });
    };

    const handleInputChange = (changedValues, allValues) => {
        if (changedValues.hasOwnProperty('employeeID') || changedValues.hasOwnProperty('name') || changedValues.hasOwnProperty('email') || changedValues.hasOwnProperty('phoneNumber')) {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            setSearchTimeout(
                setTimeout(() => {
                    handleSearch();
                }, 1000)
            );
        } else {
            handleSearch();
        } form.setFieldsValue(allValues);
    };


    const handleSearch = () => {
        const values = form.getFieldsValue();
        setFilters({
            employeeID: values.employeeID || '',
            name: values.name || '',
            email: values.email || '',
            phoneNumber: values.phoneNumber || '',
            store: values.store || [],
            gender: values.gender || 'all',
        });
        setTableParams((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const handleReset = () => {
        form.resetFields();
        setFilters({
            employeeID: '',
            name: '',
            email: '',
            phoneNumber: '',
            store: [],
            gender: 'all',
        });
        setTableParams((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const onRowClick = (record) => {
        setSelectedEmployeeID(record.employeeID);
        setSelectedEmployeeDetails(record);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEmployeeID(null);
        setSelectedEmployeeDetails(null);
    };

    const handleEmployeeDeleted = () => {
        fetchEmployees();
    }

    const handleStoreChange = (value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            store: value
        }));
        form.setFieldsValue({ store: value });
    };

    return (
        <div className="employee-list-container">
            <Form
                form={form}
                layout="vertical"
                className="filter-form"
                onValuesChange={handleInputChange}
            >
                <Row gutter={16} className="filter-form-row">
                    <Col span={5} className="filter-form-col">
                        <Form.Item label="Tên" name="name">
                            <Input placeholder="Nhập tên" className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col span={5} className="filter-form-col">
                        <Form.Item label="Email" name="email">
                            <Input placeholder="Nhập email" className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col span={5} className="filter-form-col">
                        <Form.Item label="Số Điện Thoại" name="phoneNumber">
                            <Input placeholder="Nhập số điện thoại" className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Cửa Hàng" name="store">
                            <Select
                                mode="multiple"
                                placeholder="Chọn cửa hàng"
                                allowClear
                                loading={fetchingStores}
                                onChange={handleStoreChange}
                                className="filter-form-select"
                            >
                                {stores.map((store, index) => (
                                    <Option
                                        key={store.storeID != null ? store.storeID : `fallback-${index}`}
                                        value={store.storeID}
                                    >
                                        {store.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Giới Tính" name="gender">
                            <Select placeholder="Chọn giới tính" allowClear className="filter-form-select">
                                <Option value="all">Tất cả</Option>
                                <Option value="male">Nam</Option>
                                <Option value="female">Nữ</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="filter-form-row">
                    <Col span={24} className="filter-form-col" style={{ textAlign: 'right', marginTop: '8px' }}>
                        <Button onClick={handleReset} className="filter-form-reset-button">Làm Mới</Button>
                    </Col>
                </Row>
            </Form>
            <Table
                className="employee-table"
                columns={columns}
                rowKey={(record) => record.id}
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
                <EmployeeDetailModal
                    visible={isModalOpen}
                    employeeID={selectedEmployeeID}
                    employeeDetails={selectedEmployeeDetails}
                    onClose={closeModal}
                    onEmployeeDeleted={handleEmployeeDeleted}
                />
            )}
        </div>
    );
};

export default Employee;