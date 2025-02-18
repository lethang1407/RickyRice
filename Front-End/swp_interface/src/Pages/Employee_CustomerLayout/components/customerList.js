import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Layout, Menu, theme, SearchOutlined, Select, Space, Modal, Dropdown } from 'antd';
import { ShopOutlined, EditOutlined, DeleteOutlined, SettingOutlined, DisconnectOutlined } from "@ant-design/icons";
import {
    Table,
    Input,
    Spin
} from 'antd';
import debounce from "lodash.debounce";
import moment from 'moment';
import DropDown from './customerDrop';
import { useNavigate } from 'react-router-dom';

const CustomerList = () => {
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sorterState, setSorterState] = useState(null);
    const [modalData, setModalData] = useState([]);
    const [selectedZoneName, setSelectedZoneName] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        phonesearch: null,
    });
    const navigate = useNavigate();



    const CustomerColumns = [
        {
            title: 'STT',
            key: 'stt',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Customer ID',
            dataIndex: 'customerID',
            key: 'zoneID',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => text ? moment(Number(text)).format('DD/MM/YYYY HH:mm:ss') : 'N/A'
        },
        {
            title: 'Updated At',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => text ? moment(Number(text)).format('DD/MM/YYYY HH:mm:ss') : 'N/A'
        },
        {
            title: 'Created By',
            dataIndex: 'created_by',
            key: 'created_by',
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        type="primary"
                        icon={<ShopOutlined />}
                        style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                        title="View Store created"

                        onClick={() => {
                            console.log(record)
                            showModal(record)
                        }}
                    />
                    <Button
                        type="default"
                        icon={<SettingOutlined />}
                        style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", color: "white" }}
                        title="Customer Settings"
                        onClick={() => navigate('/employee/customers/edit', { state: record })}
                    />
                    <Button
                        type="danger"
                        icon={<DisconnectOutlined />}
                        style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
                        title="Customer Disconnect"
                    />
                </div>
            ),
        }

    ];
    const StoreIN4columns = [
        {
            title: 'STT',
            key: 'stt',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Store ID',
            dataIndex: 'storeID',
            key: 'storeID',
        },

        {
            title: 'Store Image',
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: 'Store Name',
            dataIndex: 'storeName',
            key: 'name',
        },

        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'hotline',
            dataIndex: 'hotline',
            key: 'hotline',
        },
        {
            title: 'Operating Hour',
            dataIndex: 'operatingHour',
            key: 'operatingHour',
        },
        {
            title: 'Status',
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
                        {isOpen ? 'The store is OPEN' : 'The store is CLOSED'}
                    </span>
                );
            },
        },




    ];
    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;

        setCurrentPage(current);
        setPageSize(pageSize);
        //handleSearch(current, pageSize);
    };
    const handleFilterSubmit = () => {
        fetchZone(currentPage, pageSize, filters
            //null, searchTerm
        );
    };


    useEffect(() => {
        fetchZone(currentPage, pageSize, filters
            // null, searchTerm
        );
    }, [currentPage, pageSize, filters]);
    const fetchZone = async (page, size,
        filters,
        // sorter, search
    ) => {
        // const { field, order } = sorter || sorterState || {};

        try {
            const response = await axios.get('http://localhost:9999/employee/customers', {

                params: {
                    page: page - 1,
                    size: size,
                    phonesearch: filters ? filters.phonesearch : null,
                    // quantityMax: filters ? filters.quantityMax : null,
                    // sizeMin: filters ? filters.sizeMin : null,
                    // sizeMax: filters ? filters.sizeMax : null,
                    // sortBy: field,
                    // sortOrder: order || false,
                    // search: search || "",

                },
            });
            console.log("Dữ liệu liên quan22:", response.data);
            console.log(response.data.content)
            setCustomers(response.data.content);
            setTotalItems(response.data.totalElements);
            setLoading(false); //false la trang thai  loading data xong

        } catch (error) {
            console.error('nổ rồi các cháu ơi, lỗi lỗi lỗi', error)
            setLoading(false);
        }

    }
    const showModal = (zone) => {
        console.log("zone : " + zone)
        console.log("check zone :" + zone.employeeStoreDTO)
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
    const handleFilterChange = debounce((type, value) => {
        setFilters({ ...filters, [type]: value });
    }, 1000)

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 15px" }}>
                <h3><i style={{ marginLeft: 15 }}>Customer Preview </i></h3>
                <Space size="middle">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "20px" }}>
                        <Input
                            type="number"
                            placeholder="Phone Number"
                            maxLength={10}
                            style={{ width: 220 }}
                            allowClear onChange={(e) => handleFilterChange('phonesearch', e.target.value)}

                        />
                    </div>
                    <Button type="primary" onClick={handleFilterSubmit} >
                        Search
                    </Button>

                </Space>

            </div>
            <div style={{ marginLeft: 1250, marginTop: 15 }}> <DropDown /></div>
            {loading ? (<Spin size="large" />) : (
                <Table style={{ marginTop: 25 }}
                    dataSource={customers}
                    columns={CustomerColumns}
                    // rowClassName={(record) =>
                    //     record.quantity === 0 ? "row-red" : ""
                    // }

                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalItems,
                        showSizeChanger: true,
                        pageSizeOptions: ['1', '5', '10'],
                        // onChange: (page, size) => {
                        //     setCurrentPage(page);
                        //     setPageSize(size);
                        //     fetchZone(page, size, filters, null, searchTerm);
                        // },
                    }}
                    onChange={handleTableChange}
                />
            )}
            <Modal
                title={<span style={{ fontWeight: 500, fontSize: '18px' }}>Store Create Account For : {selectedZoneName}</span>}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Close
                    </Button>,
                ]}
                style={{ top: 300, left: 40 }}
                width="75%"
                bodyStyle={{ height: '10vh' }}
            >
                <Table
                    dataSource={modalData}
                    columns={StoreIN4columns}
                    rowKey={(record) => record.storeID}
                    pagination={false}
                />
            </Modal>
        </>
    )
}

export default CustomerList;