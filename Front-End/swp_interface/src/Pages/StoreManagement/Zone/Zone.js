import React, { useEffect, useState } from 'react';
import { Table, message, Input, Button, Flex, Modal } from 'antd';
import { InfoOutlined, EditOutlined } from '@ant-design/icons';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';
import moment from 'moment';
import CreateZone from './CreateZone';
import UpdateZone from './UpdateZone';
import Filter from './filter';

const { Search } = Input;

const Zone = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const token = getToken();
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const storeID = useParams();
    const [params, setParams] = useState(null);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
        sortBy: "createdAt",
        descending: false,
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);
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

    const columns = [
        { title: 'Tên Khu', dataIndex: 'name', key: 'name', width: '20%' },
        { title: 'Phân Khu', dataIndex: 'location', key: 'location', width: '10%', sorter: true },
        { title: 'Tên Sản Phẩm', dataIndex: 'productName', key: 'productName', width: '20%' },
        {
            title: 'Tạo Lúc',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '15%',
            render: (text) => (text ? moment(text).format('HH:mm DD/MM/YYYY') : 'Chưa có thông tin'),
            sorter: true,
        },
        {
            title: 'Cập Nhật Lúc',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: '15%',
            render: (text) => (text ? moment(text).format('HH:mm DD/MM/YYYY') : 'Chưa có thông tin'),
            sorter: true
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
                            setSelectedZone(record);
                            setIsInfoModalOpen(true);
                        }}
                        title="Thông tin chi tiết"
                        style={{marginLeft: '10px', marginRight: '10px'}}
                    >
                        <InfoOutlined />
                    </Button>
                    <Button
                        type=""
                        onClick={() => {
                            setSelectedZone(record);
                            setIsUpdateModalOpen(true);
                        }}
                    >
                        <EditOutlined />
                    </Button>
                </div>
            ),
        },
    ];

    const getZoneParams = (param) => {
        const { pagination, sortBy, descending } = param;
        let query = `storeID=${storeID.id}&page=${pagination.current - 1}&size=${pagination.pageSize}`;
        if (sortBy) query += `&sortBy=${sortBy}&descending=${descending}`;
        return query;
    };

    const fetchZones = async () => {
        setLoading(true);
        try {
            const queryParams = '?' + getZoneParams(tableParams) + `&${params}`;
            const response = await getDataWithToken(API.STORE_DETAIL.GET_STORE_ZONES_BY_STOREID + queryParams, token);
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
        fetchZones();
    }, [tableParams.pagination.current, tableParams.pagination.pageSize, tableParams.sortBy, tableParams.descending, params]);

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
            <Button className="btn-create" title="Thêm zone mới" onClick={() => setIsCreateModalOpen(true)}>
                Thêm mới
            </Button>
            <Filter params={params} setParams={setParams}/>
            <Table
                columns={columns}
                rowKey="id"
                dataSource={data}
                pagination={{ ...tableParams.pagination, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
                loading={loading}
                onChange={handleTableChange}
            />
            <Flex vertical gap="middle" align="flex-start">
                {/* Modal thông tin chi tiết */}
                <Modal open={isInfoModalOpen} onCancel={() => setIsInfoModalOpen(false)} footer={null}>
                    {selectedZone && (
                        <div className="zone-modal">
                            <div className="product-header">
                                <div className="product-icon">Z</div>
                                <span className="product-label">Mã: {selectedZone.id}</span>
                            </div>
                            <div className="zone-content">
                                <table>
                                    <tr>
                                        <td><strong>Tên Khu:</strong></td>
                                        <td>{selectedZone.name}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Phân Khu:</strong></td>
                                        <td>{selectedZone.location}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Tên Sản Phẩm:</strong></td>
                                        <td>{selectedZone.productName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Thông Tin Sản Phẩm:</strong></td>
                                        <td>{selectedZone.productInformation}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Tạo Bởi:</strong></td>
                                        <td>{selectedZone.createdBy || 'Chưa có thông tin'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Tạo Lúc:</strong></td>
                                        <td>{selectedZone.createdAt ? moment(selectedZone.createdAt).format('HH:mm DD/MM/YYYY') : 'Chưa có thông tin'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Cập Nhật Bởi:</strong></td>
                                        <td>{selectedZone.updatedBy || 'Chưa có thông tin'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Cập Nhật Lúc:</strong></td>
                                        <td>{selectedZone.updatedAt ? moment(selectedZone.updatedAt).format('HH:mm DD/MM/YYYY') : 'Chưa có thông tin'}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    )}
                </Modal>
                {/* Modal tạo mới */}
                <Modal
                    title="Thêm Khu Mới"
                    open={isCreateModalOpen}
                    onCancel={() => setIsCreateModalOpen(false)}
                    footer={null}>
                    <CreateZone
                        onClose={() => setIsCreateModalOpen(false)}
                        storeID={storeID.id}
                        fetchZones={fetchZones}
                        onSuccess={handleCreateSuccess}
                    />
                </Modal>
                {/* Modal cập nhật */}
                <Modal
                    title="Cập Nhật Khu"
                    open={isUpdateModalOpen}
                    onCancel={() => setIsUpdateModalOpen(false)}
                    footer={null}>
                    {selectedZone && <UpdateZone
                        zone={selectedZone}
                        onClose={() => setIsUpdateModalOpen(false)}
                        fetchZones={fetchZones}
                        onSuccess={handleUpdateSuccess}
                    />}
                </Modal>
            </Flex>
        </div>
    );
};

export default Zone;