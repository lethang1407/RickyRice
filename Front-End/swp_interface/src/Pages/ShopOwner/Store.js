import React, { useEffect, useState } from 'react';
import { Table, message, Input } from 'antd';
import qs from 'qs';

const { Search } = Input;

const Store = () => {
    console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [timeoutId, setTimeoutId] = useState(null);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 3,
        },
    });

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (_, __, index) => {
                const id = (tableParams.pagination.current - 1) * tableParams.pagination.pageSize + index + 1;
                return id;
            },
            width: '10%',
        },
        {
            title: 'Store Name',
            dataIndex: 'storeName',
            key: 'storeName',
            sorter: true,
            width: '15%',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Hotline',
            dataIndex: 'hotline',
            key: 'hotline',
            sorter: true,
            width: '15%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            width: '15%',
        },
        {
            title: 'Operating Hour',
            dataIndex: 'operatingHour',
            key: 'operatingHour',
            sorter: true,
            width: '10%',
        },
        {
            title: 'Expire At',
            dataIndex: 'expireAt',
            key: 'expireAt',
            sorter: true,
            render: (text) => new Date(text).toLocaleDateString(),
            width: '10%',
        },
    ];

    const getStoreParams = (params) => {
        const { pagination, sortField, sortOrder } = params;
        return qs.stringify({
            page: pagination.current - 1,
            size: pagination.pageSize,
            sortBy: sortField,
            descending: sortOrder === 'descend',
        });
    };

    const fetchStores = async () => {
        setLoading(true);
        try {
            const queryParams = searchValue
                ? `search-stores?storeName=${encodeURIComponent(searchValue)}&` + getStoreParams(tableParams)
                : `stores?` + getStoreParams(tableParams);
            const response = await fetch(`http://localhost:9999/store-owner/${queryParams}`);
            const result = await response.json();
            console.log(result);

            setData(result.content || []);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: result.totalElements,
                },
            });
        } catch (error) {
            message.error('Không thể tải dữ liệu danh sách stores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
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

    return (
        <div>
            <Search
                placeholder="Enter Store Name"
                onChange={handleSearch}
                enterButton
                style={{ marginBottom: 16 }}
            />
            <Table
                columns={columns}
                rowKey="storeID"
                dataSource={data}
                pagination={{
                    ...tableParams.pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['1', '2', '3', '4', '5'],
                }}
                loading={loading}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default Store;