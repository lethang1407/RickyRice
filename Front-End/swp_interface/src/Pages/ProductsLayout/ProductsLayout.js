import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logoviet.png'
import DropDown from '../ProductsEdit/ProductsEdit';
import { Table, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Pagination } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    ShopOutlined,
    VideoCameraOutlined,
    InsertRowBelowOutlined,
    TeamOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { Spin, List as ListItem } from 'antd';
import { Button, Layout, Menu, theme, SearchOutlined, Select, Space, Modal } from 'antd';
import CustomFooter from "../../Components/Footer";
import Search from 'antd/es/transfer/search';
import { getToken } from "../../Utils/UserInfoUtils";
import API from '../../Utils/API/API';
const { Header, Sider, Content } = Layout;

const ProductsList = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [products, setProducts] = useState([]);
    const [isSearch, setIsSearch] = useState(false);

    const navigate = useNavigate();
    const token = getToken();

    const [loading, setLoading] = useState(true);//true la trang thai dang loading data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectProduct, setSelectProduct] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [currentPageRelated, setCurrentPageRelated] = useState(1);
    const [pageSizeRelated, setPageSizeRelated] = useState(5);
    const [totalItemsRelated, setTotalItemsRelated] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermRelated, setSearchTermRelated] = useState("");


    const columns = [
        {
            title: 'STT',
            key: 'stt',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Category ID',
            dataIndex: 'categoryID',
            key: 'categoryID',
        },
        {
            title: 'Rice',
            dataIndex: 'name',
            key: 'rice',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Button type="primary" onClick={() =>
                    showModal(record)} >
                    See More
                </Button>
            ),
        }
    ];

    const columns2 = [
        {
            title: 'STT',
            key: 'stt',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Product ID',
            dataIndex: 'productID',
            key: 'productID',
        },
        {
            title: 'Image',
            dataIndex: 'productImage',
            key: 'image',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },

        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: "Status",
            key: "status",
            render: (text, record) => (
                <Button type="primary" style={{ backgroundColor: record.quantity === 0 ? 'red' : 'green' }} >
                    {(record.quantity === 0) ? <span>Out Of Stock</span> : <span >In Stock</span>}
                </Button>
            ),
        },

        {
            title: 'Description',
            dataIndex: 'information',
            key: 'information',
        },

    ]


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const fetchProducts = async (page, size) => {
        try {
            const response = await axios.get(API.EMPLOYEE.GET_CATEGORY_PAGINATION, {
                params: {
                    page: page - 1,
                    size: size,
                },
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm dấu backtick để sử dụng template string
                },
            });
            console.log("Dữ liệu liên quan22:", response.data);
            console.log(response.data.content)
            setProducts(response.data.content);

            setTotalItems(response.data.totalElements);
            setLoading(false); //false la trang thai  loading data xong

        } catch (error) {
            console.error('nổ rồi các cháu ơi, lỗi lỗi lỗi', error)
            setLoading(false);
        }

    }

    const handleNavigation = (path) => {
        navigate(path);
    };
    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;

        setCurrentPage(current);
        setPageSize(pageSize);
        handleSearch(current, pageSize);
    };

    useEffect(() => {
        handleSearch(currentPage, pageSize);
    }, [currentPage, pageSize]);  //render 1 lanlan



    const showModal = async (product) => {
        setSelectProduct(product);
        console.log(product)
        setIsModalOpen(true);
        setCurrentPageRelated(1);
        setPageSizeRelated(5);

        try {
            const response = await axios.get(API.EMPLOYEE.GET_PRODUCTS_BY_CATEGORY, {
                params: {
                    categoryID: product.categoryID,
                    page: 0,
                    size: 10,

                },
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm dấu backtick để sử dụng template string
                },

            });
            console.log(product.categoryID)

            console.log("Sản phẩm cùng Category ID:", response.data);
            console.log(response.data)
            setRelatedProducts(response.data.content);
            setTotalItemsRelated(response.data.totalElements);

        } catch (error) {
            console.error("Lỗi khi tải sản phẩm cùng Category ID:", error);
        }


    };
    const handleTableChangeRelated = (pagination) => {
        setCurrentPageRelated(pagination.current);
        setPageSizeRelated(pagination.pageSize);
        handleSearchRelated(selectProduct.categoryID, pagination.current, pagination.pageSize)
    };


    const fetchRelatedProducts = async (categoryID, page, size) => {
        try {
            setLoading(true);
            const response = await axios.get(API.EMPLOYEE.GET_PRODUCTS_BY_CATEGORY, {
                params: {
                    categoryID: categoryID,
                    page: page - 1,
                    size: size,
                },
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm dấu backtick để sử dụng template string
                },
            });

            console.log("Dữ liệu liên quan:", response.data);
            setRelatedProducts(response.data.content);
            setTotalItemsRelated(response.data.totalElements);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu phân trang:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSearch = async (page, size) => {
        try {
            const response = await axios.get(API.EMPLOYEE.GET_CATEGORY_BY_NAME, {
                params: {
                    name: isSearch ? searchTerm : '',
                    page: page - 1,
                    size: size,
                },
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm dấu backtick để sử dụng template string
                },
            });
            console.log("Search response:", response.data);
            setProducts(response.data.content);
            setTotalItems(response.data.totalElements);
        } catch (error) {
            console.error('Lỗi khi gọi API tìm kiếm:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchRelated = async (categoryID, page, size) => {
        setLoading(true);
        try {
            const response = await axios.get(API.EMPLOYEE.GET_PRODUCTS_BY_NAME, {
                params: {
                    name: searchTermRelated,
                    categoryID: categoryID,
                    page: page - 1,
                    size: size,
                },
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm dấu backtick để sử dụng template string
                },
            });
            console.log("Search response:", response.data);
            setRelatedProducts(response.data.content);
            setTotalItems(response.data.totalElements);
        } catch (error) {
            console.error('Lỗi khi gọi API tìm kiếm:', error);
        } finally {
            setLoading(false);
        }
    };



    return (

        <div style={{ display: 'flex', flexDirection: 'column' }}>

            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    style={{
                        backgroundColor: 'white',
                        color: '#fff',
                    }}
                    trigger={null} collapsible collapsed={collapsed}>
                    <div className="demo-logo-vertical" />
                    <div style={{ height: '80px' }}>
                        <img style={{ width: '90px', marginRight: '100px' }} src={logo} alt="logo" class="header__navbar__img" />
                    </div>
                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                    >
                        <Menu.Item
                            key="1"
                            icon={<InsertRowBelowOutlined />}
                            onClick={() => handleNavigation('/employee/products')}
                        >
                            Grain Selection
                        </Menu.Item>
                        <Menu.Item
                            key="2"
                            icon={<ShopOutlined />}
                            onClick={() => handleNavigation('/employee/ricezone')}
                        >
                            Rice Zone
                        </Menu.Item>
                        <Menu.Item
                            key="3"
                            icon={<UploadOutlined />}
                            onClick={() => handleNavigation('/employee/customers')}
                        >
                            Customer
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header
                        style={{
                            padding: '0 16px',
                            background: colorBgContainer,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >

                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />

                        <Space.Compact
                            style={{
                                width: '100%',
                            }}
                        >
                            <Input
                                placeholder='Tìm Tên Loại Gạo.....'
                                value={searchTerm}
                                onChange={(e) => { setIsSearch(false); setSearchTerm(e.target.value) }}
                            />
                            <Button type="primary" onClick={() => { setIsSearch(true); handleSearch(1, pageSize) }}>Search</Button>
                        </Space.Compact>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 15px" }}>
                            <h3><i style={{ marginLeft: 15 }}>Category Product Preview </i></h3>
                            {/* <span style={{ marginLeft: 840 }}> <DropDown /></span> */}
                        </div>

                        {loading ? (<Spin size="large" />) : (
                            <Table style={{ marginTop: 45 }}
                                dataSource={products}
                                columns={columns}
                                rowClassName={(record) =>
                                    record.quantity === 0 ? "row-red" : ""
                                }

                                pagination={{
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: totalItems,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['1', '10', '20', '50', '100'],
                                }}
                                onChange={handleTableChange}
                            />
                        )}



                        {
                            selectProduct &&
                            <>
                                <Modal title={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 800, fontSize: '18px' }}>Product: {selectProduct.name}</span>
                                        <Space.Compact
                                            style={{
                                                display: 'flex',
                                                alignItems: 'cen',
                                                gap: '5px',
                                                marginLeft: '750px',
                                            }}
                                        >
                                            <Input
                                                placeholder='Tìm Kiếm Tên Sản Phẩm...'
                                                value={searchTermRelated}
                                                onChange={(e) => setSearchTermRelated(e.target.value)}
                                                style={{
                                                    width: 200,
                                                    height: 30,
                                                    fontSize: '14px',
                                                }}

                                            />
                                            <Button type="primary" onClick={() => handleSearchRelated(selectProduct.categoryID, 1, pageSize)}
                                                style={{ height: 30, fontSize: '14px' }}
                                            >
                                                Search
                                            </Button>
                                        </Space.Compact>
                                    </div>
                                } style={{ top: 60, left: 40 }}
                                    width="75%"
                                    bodyStyle={{ height: '70vh' }}

                                    open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                                    {loading ? (<Spin size="large" />) : (
                                        <Table style={{ marginTop: 60 }}
                                            dataSource={relatedProducts}
                                            columns={columns2}
                                            pagination={{
                                                current: currentPageRelated,
                                                pageSize: pageSizeRelated,
                                                total: totalItemsRelated,
                                                showSizeChanger: true,
                                                pageSizeOptions: ['1', '5', '10'],

                                            }}
                                            rowClassName={(record) =>
                                                record.quantity === 0 ? "row-red" : ""
                                            }
                                            onChange={handleTableChangeRelated}

                                        />
                                    )}
                                </Modal>
                            </>
                        }
                    </Content>
                </Layout>
            </Layout>
            <CustomFooter />
        </div>
    );
};
export default ProductsList;