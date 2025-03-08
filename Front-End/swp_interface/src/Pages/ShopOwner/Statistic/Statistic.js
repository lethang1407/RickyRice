import React, { useEffect, useState } from 'react';
import { Table, message, Input } from 'antd';
import qs from 'qs';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import API from '../../../Utils/API/API';
import './style.scss'

const { Search } = Input;

const Statistic = () => {
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
        sortField: null,
        sortOrder: null,
    });

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
            title: 'Statistic ID',
            dataIndex: 'statisticsID',
            key: 'statisticsID',
            width: '10%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (type) => (
                <span style={{ color: type === 'Export' ? 'green' : 'red' }}>
                    {type === 'Export' ? 'Xuất Khẩu' : 'Nhập Khẩu'}
                </span>
            ),
            width: '10%',
        },
        {
            title: 'Store Name',
            dataIndex: 'storeName',
            key: 'storeName',
            width: '15%',
        },
        {
            title: 'Total Money',
            dataIndex: 'totalMoney',
            key: 'totalMoney',
            render: (totalMoney) => `${totalMoney.toFixed(3)} đ`,
            sorter: true,
            width: '15%',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: '20%',
        }
    ];

    const getStatisticParams = (params) => {
        const { pagination, sortField, sortOrder } = params;
        return qs.stringify({
            page: pagination.current - 1,
            size: pagination.pageSize,
            sortBy: sortField || "createdAt",
            descending: sortOrder === "descend",
        });
    };

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const queryParams = `?storeName=${encodeURIComponent(searchValue)}&` + getStatisticParams(tableParams);
            const response = await getDataWithToken(API.STORE_OWNER.GET_STORE_STATISTICs + queryParams, token);
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
        searchValue
    ]);

    const handleTableChange = (pagination, _, sorter) => {
        setTableParams({
            pagination,
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

    return (
        <div>
            <Search
                placeholder="Enter Store Name"
                onChange={handleSearch}
                enterButton
                style={{ marginBottom: 16 }}
                loading={loading}
            />
            <Table
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