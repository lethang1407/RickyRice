import React, { useEffect, useState } from 'react';
import { Table, message, Input } from 'antd';
import qs from 'qs';
import Loading from '../../Loading/Loading';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import ProductDetailModal from '../../../Components/StoreOwner/ProductDetailModal/ProductDetailModal'; // Đảm bảo đường dẫn đúng
import './style.scss';

const { Search } = Input;

const Product = () => {
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
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductID, setSelectedProductID] = useState(null);

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
            title: 'ProductID',
            dataIndex: 'productID',
            key: 'productID',
            width: '8%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            render: (price) => `${price.toFixed(3)} đ`,
            width: '10%',
        },
        {
            title: 'Information',
            dataIndex: 'information',
            key: 'information',
            ellipsis: true,
            width: '30%',
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: '20%',
        },
    ];

    const getProductParam = (params) => {
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
            const queryParams = `?productName=${encodeURIComponent(searchValue)}&` + getProductParam(tableParams);
            const response = await getDataWithToken(API.STORE_OWNER.GET_STORE_PRODUCTS + queryParams, token);
            setData(response.content || []);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: response.totalElements,
                },
            });
        } catch (error) {
            message.error('Không thể tải dữ liệu danh sách products');
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

    return (
        <div>
            <Search
                placeholder="Enter Product Name"
                onChange={handleSearch}
                enterButton
                style={{ marginBottom: 16 }}
                loading={loading}
            />
            <Table
                columns={columns}
                rowKey="productID"
                dataSource={data}
                pagination={{
                    ...tableParams.pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['1', '2', '3', '4', '5'],
                }}
                loading={loading}
                onChange={handleTableChange}
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedProductID(record.productID);
                        setIsModalOpen(true);
                    },
                    style: { cursor: 'pointer' },
                })}
            />
            {isModalOpen && (
                <ProductDetailModal
                    visible={isModalOpen}
                    productID={selectedProductID}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Product;