import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Layout, Menu, theme, SearchOutlined, Select, Space, Modal, Dropdown, Form, message } from 'antd';
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
import { getToken } from '../../../Utils/UserInfoUtils';
import API from '../../../Utils/API/API';
import '../style.css'
import { success, error } from '../../../Utils/AntdNotification';

const { TextArea } = Input;
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
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [filters, setFilters] = useState({
        phonesearch: null,
    });
    const navigate = useNavigate();
    const refreshData = () => {
        fetchZone(currentPage || 1, pageSize || 10, filters || {});
    };
    const token = getToken();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();


    const CustomerColumns = [
        {
            title: 'STT',
            key: 'stt',
            render: (text, record, index) => index + 1,
            width: '2%',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: 'SDT',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 70
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 200
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200
        },
        {
            title: 'Tạo Ra Lúc',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => text ? moment(Number(text)).format('DD/MM/YYYY HH:mm:ss') : 'N/A'
        },
        {
            title: 'Chỉnh Sửa Lúc',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => text ? moment(Number(text)).format('DD/MM/YYYY HH:mm:ss') : 'N/A'
        },
        {
            title: 'Tạo Bởi ',
            dataIndex: 'created_by',
            key: 'created_by',
            width: 150
        },
        {
            title: "Cửa Hàng",
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
                        onClick={() => showEditModal(record)}
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
            width: 30,
        },
        {
            title: 'ID Cửa Hàng',
            dataIndex: 'storeID',
            key: 'storeID',
            width: 130,
        },

        {
            title: 'Hình Ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 100,
        },
        {
            title: 'Tên ',
            dataIndex: 'storeName',
            key: 'name',
            width: 150,
        },

        {
            title: 'Địa Chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 200,
        },
        {
            title: 'Hotline',
            dataIndex: 'hotline',
            key: 'hotline',
            width: 120,
        },
        {
            title: 'Giờ Mở Cửa',
            dataIndex: 'operatingHour',
            key: 'operatingHour',
            width: 170,
        },
        {
            title: 'Trạng Thái',
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
                        {isOpen ? 'Cửa Hàng Đang Mở' : 'Cửa Hàng Đã Đóng'}
                    </span>
                );
            },
        },




    ];
    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;

        setCurrentPage(current || 1);
        setPageSize(pageSize || 10);
        //handleSearch(current, pageSize);
    };
    const handleFilterSubmit = () => {
        fetchZone(currentPage, pageSize, filters
            //null, searchTerm
        );
    };


    useEffect(() => {
        fetchZone(currentPage, pageSize, filters);
    }, [currentPage, pageSize, filters]);
    const fetchZone = async (page, size, filters,) => {
        // const { field, order } = sorter || sorterState || {};
        console.log("fetchZone được gọi với các tham số:", { page, size, filters });
        try {
            const response = await axios.get(API.EMPLOYEE.GET_ALL_CUSTOMER, {

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
                headers: {
                    Authorization: `Bearer ${token}`, // Chèn token vào header
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
    const showEditModal = (record) => {
        setSelectedCustomer(record);
        form.setFieldsValue({
            name: record.name,
            phoneNumber: record.phoneNumber,
            email: record.email,
            address: record.address,
        });
        setIsEditModalVisible(true);
    };
    const handleEditOk = () => {
        form.submit();
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        form.resetFields();
    };
    const handleEditSubmit = async (values) => {
        try {
            const requestData = {
                customerID: selectedCustomer.customerID,
                name: values.name,
                phoneNumber: values.phoneNumber,
                email: values.email,
                address: values.address,
                updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss'),
            };

            const response = await axios.put(
                API.EMPLOYEE.UPDATE_USER(selectedCustomer.customerID),
                requestData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 || response.status === 204) {
                success('Cập nhật khách hàng thành công!', messageApi);
                setIsEditModalVisible(false);
                refreshData();
            }
        } catch (err) {
            error(err.response?.data?.message || "Tạo mới tài khoản thất bại.", messageApi);
        }
    };
    const handleFilterChange = debounce((type, value) => {
        setFilters({ ...filters, [type]: value });
    }, 1000)

    return (
        <>
            {contextHolder}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 15px" }}>
                <h3><i style={{ marginLeft: 15, color: "#E3C584" }}>Danh Sách Khách Hàng  </i></h3>
                <Space size="middle">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "20px" }}>
                        <Input
                            placeholder="Tìm SDT"
                            maxLength={10}
                            style={{ width: 220 }}
                            allowClear onChange={(e) => handleFilterChange('phonesearch', e.target.value)}

                        />
                    </div>
                    <Button type="primary" onClick={handleFilterSubmit} >
                        Tìm Kiếm
                    </Button>

                </Space>

            </div>
            <div style={{ marginLeft: 1250, marginTop: 15 }}> <DropDown refreshData={fetchZone} /></div>
            {loading ? (<Spin size="large" />) : (
                <Table style={{ marginTop: 25 }}
                    dataSource={customers}
                    columns={CustomerColumns}
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
                    className="custom-table"
                />
            )}
            <Modal
                title={<span style={{ fontWeight: 500, fontSize: '18px', color: "#E3C584" }}> Cửa Hàng Đã Tạo Cho : {selectedZoneName}</span>}
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
                    columns={StoreIN4columns}
                    rowKey={(record) => record.storeID}
                    pagination={false}
                />
            </Modal>
            <Modal
                title={<span style={{ fontWeight: 500, fontSize: '18px', color: "#E3C584" }}>Chỉnh sửa thông tin khách hàng</span>}
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    layout="horizontal"
                    onFinish={handleEditSubmit}
                >
                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Nhập tên khách hàng" />
                    </Form.Item>
                    <Form.Item
                        label="SĐT"
                        name="phoneNumber"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^0\d{9}$/, message: 'Vui lòng nhập 10 số và bắt đầu từ 0' },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ type: 'email', message: 'Vui lòng nhập Email hợp lệ!' }]}
                    >
                        <Input placeholder="Nhập Email của khách hàng" />
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="address">
                        <TextArea rows={3} placeholder="Nhập địa chỉ" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default CustomerList;