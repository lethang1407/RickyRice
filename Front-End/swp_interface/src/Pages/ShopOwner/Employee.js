import React, { useEffect, useState } from 'react';
import { Table, message, Input } from 'antd';
import qs from 'qs';
// import EmployeeDetailModal from '../../Components/StoreOwner/EmployeeDetailModal/EmployeeDetailModal';
import { getToken } from '../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../Utils/FetchUtils';
import API from '../../Utils/API/API';

const { Search } = Input;

const Employee = () => {
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
    const [selectedEmployeeID, setSelectedEmployeeID] = useState(null);

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
            filters: [
                { text: 'Male', value: 'Male' },
                { text: 'Female', value: 'Female' }
            ],
            filterMultiple: false,
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

    const getEmployeeParams = (params) => {
        const { pagination, sortField, sortOrder, filters } = params;
        return qs.stringify({
            page: pagination.current - 1,
            size: pagination.pageSize,
            sortBy: sortField || 'createdAt',
            descending: sortOrder === "descend",
            gender: filters?.gender?.[0] || "all",
        });
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const queryParams = `?employeeName=${encodeURIComponent(searchValue)}&` + getEmployeeParams(tableParams);
            const response = await getDataWithToken(API.STORE_OWNER.GET_STORE_EMPLOYEES + queryParams, token);
            console.log(response);
            
            setData(response.content || []);
            setTableParams((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: response.totalElements,
                },
            }));
        } catch (error) {
            message.error('Không thể tải dữ liệu danh sách nhân viên');
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
        tableParams.filters,
        searchValue
    ]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortField: sorter?.field || null,
            sortOrder: sorter?.order || null,
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
        setSelectedEmployeeID(record.employeeID);
        setIsModalOpen(true);
    };

    // const closeModal = () => {
    //     setIsModalOpen(false);
    //     setSelectedEmployeeID(null);
    // };

    return (
        <div>
            <Search
                placeholder="Enter Employee Name"
                onChange={handleSearch}
                enterButton
                style={{ marginBottom: 16 }}
                loading={loading}
            />
            <Table
                columns={columns}
                rowKey="employeeID"
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

            {/* {isModalOpen && (
                <EmployeeDetailModal
                    visible={isModalOpen}
                    employeeID={selectedEmployeeID}
                    employeeDetails={data.find(employee => employee.employeeID === selectedEmployeeID) || {}}
                    onClose={closeModal}
                />
            )} */}
        </div>
    );
};

export default Employee;