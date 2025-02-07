import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logoviet.png'

import { Table, Input } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    ShopOutlined,
    VideoCameraOutlined,
    InsertRowBelowOutlined,
} from '@ant-design/icons';

import axios from 'axios';
import { Spin, List as ListItem } from 'antd';

import { Button, Layout, Menu, theme, SearchOutlined, Select, Space, Modal } from 'antd';

import { List } from "antd";

import './style.css';
import CustomFooter from "../../Components/Footer";
import Search from 'antd/es/transfer/search';
const { Header, Sider, Content } = Layout;

const ProductsList = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(true);//true la trang thai dang loading data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectProduct, setSelectProduct] = useState(null)

    const [relatedProducts, setRelatedProducts] = useState([]);


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

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:9999/home/owner/products');
            console.log(response.data)
            setProducts(response.data);
            setFilteredProducts(response.data);
            setLoading(false); //false la trang thai  loading data xong

        } catch (error) {
            console.error('nổ rồi các cháu ơi, lỗi lỗi lỗi', error)
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchProducts();
    }, []);  //render 1 lanlan


    const handleSearch = () => {
        if (!searchValue || searchValue.trim() === "") {

            setFilteredProducts(products);
            return;
        }
        const filtered = products.filter((item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredProducts(filtered);


    };


    const showModal = async (product) => {
        setSelectProduct(product);
        console.log(product)
        setIsModalOpen(true);

        try {
            const response = await axios.get(`http://localhost:9999/home/owner/products/byCategory`, {
                params: {
                    categoryID: product.categoryID,

                }

            });
            console.log(product.categoryID)

            console.log("Sản phẩm cùng Category ID:", response.data);
            setRelatedProducts(response.data);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm cùng Category ID:", error);
        }


    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };





    return (

        <div style={{ display: 'flex', flexDirection: 'column' }}>

            <Layout>
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
                        items={[
                            {
                                key: '1',
                                icon: <InsertRowBelowOutlined />,
                                label: 'Grain Selection ',
                            },
                            {
                                key: '2',
                                icon: <ShopOutlined />,
                                label: 'nav 2',
                            },
                            {
                                key: '3',
                                icon: <UploadOutlined />,
                                label: 'nav 3',
                            },
                        ]}
                    />
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
                                placeholder='Search something here'
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}

                            />
                            <Button type="primary" onClick={handleSearch}>Search</Button>
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
                        <h3><i style={{ marginLeft: 15 }}>Category Product Preview </i></h3>


                        {loading ? (<Spin size="large" />) : (
                            <Table
                                dataSource={filteredProducts}
                                columns={columns}
                                rowClassName={(record) =>
                                    record.quantity === 0 ? "row-red" : ""
                                }
                            />
                        )}



                        {
                            selectProduct &&
                            <>
                                <Modal title={
                                    <>
                                        <span style={{ fontWeight: 800 }}> Product : </span> {selectProduct.name}
                                    </>
                                } style={{ top: 60, left: 40 }}
                                    width="75%"
                                    bodyStyle={{ height: '50vh' }}

                                    open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                                    {loading ? (<Spin size="large" />) : (
                                        <Table
                                            dataSource={relatedProducts}
                                            columns={columns2}
                                            rowClassName={(record) =>
                                                record.quantity === 0 ? "row-red" : ""
                                            }
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
