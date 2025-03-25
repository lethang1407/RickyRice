import React, { useEffect, useState } from 'react';
import { Table, message, Input, Button, Flex, Modal, Popconfirm } from 'antd';
import { InfoOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';
import CreateProductAttribute from './CreateProductAttribute';
import UpdateProductAttribute from './UpdateProductAttribute';

const { Search } = Input;

const ProductAttribute = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const token = getToken();
    const navigate = useNavigate();
    const storeID = useParams();

    // States
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
        sortBy: "value",
        descending: false,
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const handleCreateSuccess = (key) => {
        messageApi.open({
            key,
            type: 'loading',
            content: 'Đang thêm sản phẩm...',
        });
        setTimeout(() => {
            messageApi.open({
                key,
                type: 'success',
                content: 'Thêm sản phẩm thành công!',
                duration: 2,
            });
        }, 1000);
    };

    const handleUpdateSuccess = (key) => {
        messageApi.open({
            key,
            type: 'loading',
            content: 'Đang cập nhật sản phẩm...',
        });
        setTimeout(() => {
            messageApi.open({
                key,
                type: 'success',
                content: 'Cập nhật sản phẩm thành công!',
                duration: 2,
            });
        }, 1000);
    };

    const handleDelete = (record) => {
        const key = 'deleteProductKey';
        messageApi.open({
            key,
            type: 'loading',
            content: 'Đang xóa sản phẩm...',
        });
        fetch(`${API.STORE_DETAIL.DELETE_STORE_PRODUCT_ATTRIBUTE(record.id)}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) throw new Error('Không thể xóa sản phẩm');
                messageApi.open({
                    key,
                    type: 'success',
                    content: 'Xóa sản phẩm thành công!',
                    duration: 2,
                });
                fetchAttributes();
            })
            .catch((error) => {
                messageApi.open({
                    key,
                    type: 'error',
                    content: 'Không thể xóa sản phẩm',
                });
            });
    };

    // Table columns
    const columns = [
        { title: 'Thuộc Tính Sản Phẩm', dataIndex: 'value', key: 'value', width: '65%' },
        {
            title: 'Actions',
            key: 'action',
            width: '35%',
            render: (record) => (
                <div>
                    <Button
                        type="primary"
                        onClick={() => {
                            setSelectedAttribute(record);
                            setIsInfoModalOpen(true);
                        }}
                        title="View Details"
                    >
                        <InfoOutlined />
                    </Button>
                    <Button
                        type=""
                        onClick={() => {
                            setSelectedAttribute(record);
                            setIsUpdateModalOpen(true);
                        }}
                    >
                        <EditOutlined />
                    </Button>
                    <Popconfirm
                        title="Xóa sản phẩm"
                        description="Bạn có chắc chắn muốn xóa không?"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button id="delete-button">
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    // Build API Query Parameters
    const getAttributeParams = (params) => {
        const { pagination, sortBy, descending } = params;
        let query = `storeID=${storeID.id}&page=${pagination.current - 1}&size=${pagination.pageSize}`;
        if (sortBy) query += `&sortBy=${sortBy}&descending=${descending}`;
        return query;
    };

    // Fetch Attributes
    const fetchAttributes = async () => {
        setLoading(true);
        try {
            const queryParams = '?' + getAttributeParams(tableParams);
            const response = await getDataWithToken(API.STORE_DETAIL.GET_STORE_PRODUCT_ATTRIBUTES + queryParams, token);
            if (!response || !response.content) throw new Error('Invalid response');
            setData(response.content);
            setTableParams((prev) => ({
                ...prev,
                pagination: { ...prev.pagination, total: response.totalElements },
            }));
        } catch (error) {
            navigate('/unauthorized');
        } finally {
            setLoading(false);
        }
    };

    // Trigger fetch on parameter change
    useEffect(() => {
        fetchAttributes();
    }, [tableParams.pagination.current, tableParams.pagination.pageSize, tableParams.sortBy, tableParams.descending, searchValue]);

    // Handle table change (pagination, sorting)
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams((prev) => ({
            ...prev,
            pagination,
            sortBy: sorter.field || 'value',
            descending: sorter.order === 'descend',
        }));
    };

    return (
        <div>
            {contextHolder}
            <Button className="btn-create" title="Add New Product Attribute" onClick={() => setIsCreateModalOpen(true)}>
                Thêm mới
            </Button>
            <Table
                columns={columns}
                rowKey="id"
                dataSource={data}
                pagination={{ ...tableParams.pagination, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
                loading={loading}
                onChange={handleTableChange}
            />
            <Flex vertical gap="middle" align="flex-start">
                {/* Info Modal */}
                <Modal open={isInfoModalOpen} onCancel={() => setIsInfoModalOpen(false)} footer={null}>
                    {selectedAttribute && (
                        <div className="attribute-modal">
                            <div className="product-header">
                                <div className="product-icon">A</div>
                                <span className="product-label">ID: {selectedAttribute.id}</span>
                            </div>
                            <div className="attribute-content">
                                <table>
                                    <tr>
                                        <td><strong>Value:</strong></td>
                                        <td>{selectedAttribute.value}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    )}
                </Modal>
                {/* Create Modal */}
                <Modal
                    title="Thêm mới thuộc tính sản phẩm"
                    open={isCreateModalOpen}
                    onCancel={() => setIsCreateModalOpen(false)}
                    footer={null}>
                    <CreateProductAttribute
                        onClose={() => setIsCreateModalOpen(false)}
                        storeID={storeID.id}
                        fetchAttributes={fetchAttributes}
                        onSuccess={handleCreateSuccess}
                    />
                </Modal>
                {/* Update Modal */}
                <Modal
                    title="Cập nhật thuộc tính sản phẩm"
                    open={isUpdateModalOpen}
                    onCancel={() => setIsUpdateModalOpen(false)}
                    footer={null}>
                    {selectedAttribute && (
                        <UpdateProductAttribute
                            attribute={selectedAttribute}
                            storeID={storeID.id}
                            onClose={() => setIsUpdateModalOpen(false)}
                            fetchAttributes={fetchAttributes}
                            onSuccess={handleUpdateSuccess}
                        />
                    )}
                </Modal>
            </Flex>
        </div>
    );
};

export default ProductAttribute;