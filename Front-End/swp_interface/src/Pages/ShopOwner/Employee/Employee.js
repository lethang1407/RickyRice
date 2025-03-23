import React, { useEffect, useState } from 'react';
import { Table, message, Input, Form, Select, Row, Col, Button } from 'antd';
import qs from 'qs';
// import EmployeeDetailModal from '../../Components/StoreOwner/EmployeeDetailModal/EmployeeDetailModal';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import API from '../../../Utils/API/API';
import './style.scss'
import EmployeeDetailModal from '../../../Components/StoreOwner/EmployeeDetailModal/EmployeeDetailModal';

const { Search } = Input;
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
            title: 'Employee ID',
            dataIndex: 'employeeID',
            key: 'employeeID',
            width: '10%',
        },
        {
            title: 'Employee Details',
            key: 'employeeDetails',
            render: (_, record) => (
                <>
                    <div><strong>Name:</strong> {record.storeAccount?.name || 'N/A'}</div>
                    <div><strong>Email:</strong> {record.storeAccount?.email || 'N/A'}</div>
                </>
            ),
            width: '20%',
        },
        {
            title: 'Store Name',
            dataIndex: 'storeInfo',
            key: 'storeInfo',
            render: (storeInfo) => storeInfo?.storeName || 'N/A',
            width: '15%',
        },
        {
            title: 'Gender',
            dataIndex: 'storeAccount',
            key: 'gender',
            render: (storeAccount) => (storeAccount?.gender == true ? 'Male' : 'Female'),
            width: '10%',
        },
        {
            title: 'Phone Number',
            dataIndex: 'storeAccount',
            key: 'phoneNumber',
            render: (storeAccount) => storeAccount?.phoneNumber || 'N/A',
            width: '15%',
        },
        {
            title: 'Account Information',
            dataIndex: 'storeAccount',
            key: 'accountInfo',
            render: (storeAccount) => (
                <>
                    <div><strong>Username:</strong> {storeAccount?.username || 'N/A'}</div>
                    <div><strong>Phone:</strong> {storeAccount?.phoneNumber || 'N/A'}</div>
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
                    message.error('Failed to fetch stores: Invalid response format');
                    setStores([]);
                }
            } catch (error) {
                message.error('Could not fetch stores.');
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
            if (Array.isArray(response.content)) {
                setData(response.content);
            } else {
                message.error('Failed to fetch employees: Invalid response format');
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
        }form.setFieldsValue(allValues); 
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
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Employee ID" name="employeeID">
                            <Input placeholder="Enter employee ID" />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Name" name="name">
                            <Input placeholder="Enter name" />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Email" name="email">
                            <Input placeholder="Enter email" />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Phone Number" name="phoneNumber">
                            <Input placeholder="Enter phone number" />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="filter-form-col">
                        <Form.Item label="Store" name="store">
                            <Select
                                mode="multiple"
                                placeholder="Select stores"
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
                        <Form.Item label="Gender" name="gender">
                            <Select placeholder="Select gender" allowClear className="filter-form-select">
                                <Option value="all">All</Option>
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="filter-form-row">
                    <Col span={24} className="filter-form-col" style={{ textAlign: 'right', marginTop: '8px' }}>
                        <Button onClick={handleReset} className="filter-form-reset-button">Reset</Button>
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