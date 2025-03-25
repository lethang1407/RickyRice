import React, { useEffect, useState } from 'react';
import { Table, message, Input, Button, Flex, Modal, Tag, Popconfirm } from 'antd';
import { InfoOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';
import moment from 'moment';
import CreateProduct from './CreateProduct';
import UpdateProduct from './UpdateProduct';

const { Search } = Input;
const { confirm } = Modal;

const Product = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const token = getToken();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const storeID = useParams();
    const navigate = useNavigate();

    const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
        sortBy: 'createdAt',
        descending: false,
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [category, setCategory] = useState(null);

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
        fetch(`${API.STORE_DETAIL.DELETE_STORE_PRODUCT(record.id)}`, {
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
                fetchProducts();
            })
            .catch((error) => {
                messageApi.open({
                    key,
                    type: 'error',
                    content: 'Không thể xóa sản phẩm',
                });
            });
    };

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'productImage',
            key: 'productImage',
            width: '10%',
            render: (productImage) => (
                <img style={{ width: '100%' }} src={productImage} alt="" />
            ),
        },
        { title: 'Tên Sản Phẩm', dataIndex: 'name', key: 'name', width: '15%' },
        { title: 'Giá', dataIndex: 'price', key: 'price', width: '5%', sorter: true },
        {
            title: 'Thuộc Tính Sản Phẩm',
            dataIndex: 'storeDetailProductAttributeDTOList',
            key: 'storeDetailProductAttributeDTOList',
            width: '15%',
            render: (storeDetailProductAttributeDTOList) =>
                storeDetailProductAttributeDTOList.map(productAttributeDTO => {
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    return <Tag color={randomColor}>{productAttributeDTO.value}</Tag>;
                }),
        },
        { title: 'Số Lượng', dataIndex: 'quantity', key: 'quantity', width: '5%', sorter: true },
        { title: 'Thông Tin Sản Phẩm', dataIndex: 'information', key: 'information', width: '15%' },
        {
            title: 'Tạo Lúc',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '10%',
            render: (text) => (text ? moment(text).format('HH:mm DD/MM/YYYY') : 'Chưa có thông tin'),
            sorter: true,
        },
        {
            title: 'Cập Nhật Lúc',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: '10%',
            render: (text) => (text ? moment(text).format('HH:mm DD/MM/YYYY') : 'Chưa có thông tin'),
            sorter: true,
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (record) => (
                <div>
                    <Button
                        type="primary"
                        onClick={() => {
                            fetch(`${API.STORE_DETAIL.GET_CATEGORY_ID}?categoryID=${record.categoryID}`, {
                                headers: { 'Authorization': `Bearer ${token}` },
                            })
                                .then((response) => {
                                    if (!response.ok) throw new Error('Không thể lấy thông tin danh mục');
                                    return response.json();
                                })
                                .then((data) => {
                                    setCategory(data);
                                    setSelectedProduct(record);
                                    setIsInfoModalOpen(true);
                                })
                                .catch((error) => {
                                    console.error('Lỗi khi lấy chi tiết danh mục:', error);
                                    messageApi.error('Không thể tải thông tin danh mục');
                                });
                        }}
                        title="Thông tin chi tiết"
                    >
                        <InfoOutlined />
                    </Button>
                    <Button
                        type=""
                        onClick={() => {
                            fetch(`${API.STORE_DETAIL.GET_CATEGORY_ID}?categoryID=${record.categoryID}`, {
                                headers: { 'Authorization': `Bearer ${token}` },
                            })
                                .then((response) => {
                                    if (!response.ok) throw new Error('Không thể lấy thông tin danh mục');
                                    return response.json();
                                })
                                .then((data) => {
                                    setCategory(data);
                                    setSelectedProduct(record);
                                    setIsUpdateModalOpen(true);
                                })
                                .catch((error) => {
                                    console.error('Lỗi khi lấy chi tiết danh mục:', error);
                                    messageApi.error('Không thể tải thông tin danh mục');
                                });
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

    const getProductParams = (params, searchValue) => {
        const { pagination, sortBy, descending } = params;
        let query = `storeID=${storeID.id}&page=${Math.max(pagination.current - 1, 0)}&size=${pagination.pageSize}`;
        if (sortBy) query += `&sortBy=${sortBy}&descending=${descending}`;
        if (searchValue) query += `&search=${encodeURIComponent(searchValue)}`;
        return query;
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryParams = '?' + getProductParams(tableParams, searchValue);
            const response = await getDataWithToken(API.STORE_DETAIL.GET_STORE_PRODUCTS_BY_STOREID + queryParams, token);
            if (!response || !response.content) throw new Error('Dữ liệu trả về không hợp lệ');
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

    useEffect(() => {
        fetchProducts();
    }, [tableParams.pagination.current, tableParams.pagination.pageSize, tableParams.sortBy, tableParams.descending, searchValue]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams((prev) => ({
            ...prev,
            pagination,
            sortBy: sorter.field || 'createdAt',
            descending: sorter.order === 'descend',
        }));
    };

    return (
        <div>
            {contextHolder}
            <Button className="btn-create" title="Thêm sản phẩm mới" onClick={() => setIsCreateModalOpen(true)}>
                Thêm mới
            </Button>
            <Search
                placeholder="Nhập tên sản phẩm/mô tả..."
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value);
                    setTableParams((prev) => ({
                        ...prev,
                        pagination: { ...prev.pagination, current: 1 },
                    }));
                }}
                enterButton
            />
            <Table
                columns={columns}
                rowKey="id"
                dataSource={data}
                pagination={{
                    ...tableParams.pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                }}
                loading={loading}
                onChange={handleTableChange}
            />
            <Flex vertical gap="middle" align="flex-start">
                <Modal
                    open={isInfoModalOpen}
                    onCancel={() => setIsInfoModalOpen(false)}
                    footer={null}
                    width={1300}
                    bodyStyle={{ padding: 0 }}
                    style={{ top: 20 }}
                >
                    {selectedProduct && (
                        <div className="product-modal">
                            <div className="product-header">
                                <div className="product-icon">P</div>
                                <span className="product-label">Mã: {selectedProduct.id}</span>
                            </div>
                            <div className="product-content">
                                <div className="product-details">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><strong>Tên Sản Phẩm:</strong></td>
                                                <td>{selectedProduct.name}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Giá:</strong></td>
                                                <td>{selectedProduct.price}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Thuộc Tính Sản Phẩm:</strong></td>
                                                <td>
                                                    <ul>
                                                        {selectedProduct.storeDetailProductAttributeDTOList.map((attribute, index) => (
                                                            <li key={attribute.id}>{attribute.value}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Khu Vực</strong></td>
                                                <td>
                                                    <ul>
                                                        {selectedProduct.storeDetailZoneDTOList.map((attribute, index) => (
                                                            <li key={attribute.id}>{attribute.name}-{attribute.location}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Số Lượng:</strong></td>
                                                <td>{selectedProduct.quantity}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Danh mục:</strong></td>
                                                <td>{category.name || 'Chưa có thông tin'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Mô Tả:</strong></td>
                                                <td>{category.description || 'Chưa có thông tin'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Thông Tin Sản Phẩm:</strong></td>
                                                <td>{selectedProduct.information || 'Chưa có thông tin'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Tạo Bởi:</strong></td>
                                                <td>{selectedProduct.createdBy ? selectedProduct.createdBy : 'Chưa có thông tin'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Cập Nhật Bởi:</strong></td>
                                                <td>{selectedProduct.updatedBy ? selectedProduct.updatedBy : 'Chưa có thông tin'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="product-image-container">
                                    {selectedProduct.productImage ? (
                                        <img src={selectedProduct.productImage} alt="Product" />
                                    ) : (
                                        'Chưa có hình ảnh'
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
                <Modal
                    title="Thêm Sản Phẩm Mới"
                    open={isCreateModalOpen}
                    onCancel={() => setIsCreateModalOpen(false)}
                    footer={null}
                >
                    <CreateProduct
                        onClose={() => setIsCreateModalOpen(false)}
                        storeID={storeID.id}
                        fetchProducts={fetchProducts}
                        onSuccess={handleCreateSuccess}
                    />
                </Modal>
                <Modal
                    title="Cập Nhật Sản Phẩm"
                    open={isUpdateModalOpen}
                    onCancel={() => setIsUpdateModalOpen(false)}
                    footer={null}
                >
                    {selectedProduct && (
                        <UpdateProduct
                            product={selectedProduct}
                            category={category}
                            onClose={() => setIsUpdateModalOpen(false)}
                            fetchProducts={fetchProducts}
                            onSuccess={handleUpdateSuccess}
                        />
                    )}
                </Modal>
            </Flex>
        </div>
    );
};

export default Product;