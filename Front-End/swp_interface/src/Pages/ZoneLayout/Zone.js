import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo-no-background.png'
import { Table, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Pagination } from "antd";
import debounce from "lodash.debounce";
import moment from 'moment';
import './ZoneIndex.css'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    ShopOutlined,
    VideoCameraOutlined,
    InsertRowBelowOutlined,
    TeamOutlined,
    SolutionOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { Spin, List as ListItem } from 'antd';
import { Button, Layout, Menu, theme, SearchOutlined, Select, Space, Modal } from 'antd';
import CustomFooter from "../../Components/Footer";
import Search from 'antd/es/transfer/search';

import { getToken } from '../../Utils/UserInfoUtils';
import API from '../../Utils/API/API';
const { Header, Sider, Content } = Layout;




const ZoneList = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const [zone, setZone] = useState([]);
    const [modalData, setModalData] = useState([]);
    const [selectedZoneName, setSelectedZoneName] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [sorterState, setSorterState] = useState(null);
    const token = getToken();

    const [filters, setFilters] = useState({
        quantityMin: null,
        quantityMax: null,
        sizeMin: null,
        sizeMax: null,
    });

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();



    useEffect(() => {
        fetchZone(currentPage, pageSize, filters, null, searchTerm);
    }, [currentPage, pageSize, searchTerm]);

    const Zonecolumns = [
        {
            title: 'STT',
            key: 'stt',
            render: (text, record, index) => index + 1,
            width: 50,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: 'Vị Trí',
            dataIndex: 'location',
            sorter: true,
            key: 'location',
            width: 150,
        },
        {
            title: 'Chỉnh Sửa Lúc',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => text ? moment(Number(text)).format('DD/MM/YYYY HH:mm:ss') : 'N/A',
            width: 150,
        },
        {
            title: "Cửa Hàng",
            key: "actions",
            render: (text, record) => (
                <Button type="primary" onClick={() => {
                    showModal(record);
                }}
                >
                    Thông tin
                </Button>
            ),
            width: 100,
        }

    ]; const ZoneIN4columns = [
        {
            title: 'STT',
            key: 'stt',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'ID Cửa Hàng',
            dataIndex: 'storeID',
            key: 'storeID',
        },

        {
            title: 'Hình Ảnh Cửa Hàng ',
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: 'Tên',
            dataIndex: 'storeName',
            key: 'name',
        },

        {
            title: 'Địa Chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Hotline',
            dataIndex: 'hotline',
            key: 'hotline',
        },
        {
            title: 'Giờ Mở Cửa',
            dataIndex: 'operatingHour',
            key: 'operatingHour',
        },
        {
            title: 'Trạng Thái ',
            dataIndex: 'operatingHour',
            key: 'operatingHour',
            render: (text, record) => {
                const currentTime = moment();
                const [start, end] = text.split('-');
                const startTime = moment(start, 'h A');
                const endTime = moment(end, 'h A');
                const isOpen = currentTime.isBetween(startTime, endTime);


                return (
                    <span style={{ color: isOpen ? 'green' : 'red', fontWeight: 'bold' }}>
                        {isOpen ? 'Cửa Hàng Đang Mở ' : 'Cửa Hàng Đã Đóng'}
                    </span>
                );
            },
        },




    ];


    const handleFilterChange = (type, value) => {
        setFilters({ ...filters, [type]: value });
    };
    const handleFilterSubmit = () => {
        fetchZone(currentPage, pageSize, filters, null, searchTerm);
    };


    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleSearchChange = debounce((value) => {
        setSearchTerm(value);
        setLoading(true);
        fetchZone(currentPage, pageSize, filters, null, searchTerm);
    }, 1500);

    const handleTableChange = (pagination, _, sorter) => {

        const { current, pageSize } = pagination;
        const sortBy = sorter.columnKey || "size";
        const sortOrder = sorter.order
            ? sorter.order === "ascend" ? "false" : "true"
            : "false";

        setCurrentPage(current);
        setPageSize(pageSize);
        setSorterState({
            field: sortBy,
            order: sortOrder,
        });
        fetchZone(current, pageSize, filters, {
            field: sorter.columnKey,
            order: sortOrder,
        }, searchTerm);
    };
    // 'http://localhost:9999/employee/ricezone'
    const fetchZone = async (page, size, filters, sorter, search) => {
        const { field, order } = sorter || sorterState || {};
        try {
            const response = await axios.get(API.EMPLOYEE.GET_RICEZONE, {

                params: {
                    page: page - 1,
                    size: size,
                    sortBy: field,
                    sortOrder: order || false,
                    search: search || "",
                },
                headers: {
                    Authorization: `Bearer ${token}`, // Chèn token vào header
                },
            });
            console.log("Dữ liệu liên quan22:", response.data);
            console.log(response.data.content)
            setZone(response.data.content);

            setTotalItems(response.data.totalElements);
            setLoading(false); //false la trang thai  loading data xong

        } catch (error) {
            console.error('nổ rồi các cháu ơi, lỗi lỗi lỗi', error)
            setLoading(false);
        }

    }


    const showModal = (zone) => {
        setModalData(zone.employeeStoreDTO ? [zone.employeeStoreDTO] : []);
        setSelectedZoneName(zone.name);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
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
                        defaultSelectedKeys={['2']}
                    >
                        <Menu.Item
                            key="1"
                            icon={<InsertRowBelowOutlined />}
                            onClick={() => handleNavigation('/employee/products')}
                        >
                            Sản Phẩm Gạo
                        </Menu.Item>
                        <Menu.Item
                            key="2"
                            icon={<ShopOutlined />}
                            onClick={() => handleNavigation('/employee/ricezone')}
                        >
                            Khu Vực Gạo
                        </Menu.Item>
                        <Menu.Item
                            key="3"
                            icon={<TeamOutlined />}
                            onClick={() => handleNavigation('/employee/customers')}
                        >
                            Khách Hàng
                        </Menu.Item>
                        <Menu.Item
                            key="4"
                            icon={<SolutionOutlined />}
                            onClick={() => handleNavigation('/employee/invoices')}
                        >
                            Hóa Đơn
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
                        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 15px" }}>
                            <h3 style={{ textAlign: "center", margin: 0, color: "#E3C584" }}><i>Khu Vực Chứa Gạo  </i></h3>
                            <Space.Compact
                                style={{
                                    width: '20%',
                                }}
                            >
                                <Input
                                    placeholder="Tìm kiếm khu vực..."
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                                <Button type="primary">Tìm Kiếm</Button>
                            </Space.Compact>
                        </div>

                        {loading ? (<Spin size="large" />) : (
                            <Table style={{ marginTop: 45 }}
                                dataSource={zone}
                                columns={Zonecolumns}
                                rowClassName={(record) =>
                                    record.quantity === 0 ? "row-red" : ""
                                }

                                pagination={{
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: totalItems,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['1', '5', '10'],
                                    onChange: (page, size) => {
                                        setCurrentPage(page);
                                        setPageSize(size);
                                        fetchZone(page, size, filters, null, searchTerm);
                                    },
                                }}
                                onChange={handleTableChange}
                                className="custom-table"
                            />
                        )}
                    </Content>
                </Layout>
            </Layout>

            <Modal
                title={<span style={{ fontWeight: 500, fontSize: '18px', color: "#E3C584" }}> Cửa Hàng Của : {selectedZoneName}</span>}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Đóng
                    </Button>,
                ]}
                style={{ top: 300, left: 40 }}
                width="75%"
                bodyStyle={{ height: '10vh' }}
            >
                <Table
                    dataSource={modalData}
                    columns={ZoneIN4columns}
                    rowKey={(record) => record.storeID}
                    pagination={false}
                />
            </Modal>


            <CustomFooter />
        </div>
    );
};
export default ZoneList;