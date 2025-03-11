import React, { useEffect, useState } from 'react';
import { Table, message, Input, Button, Flex, Modal } from 'antd';
import { InfoOutlined, EditOutlined } from '@ant-design/icons';
import API from '../../../Utils/API/API';
import { getRole, getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';
import moment from 'moment';
import CreateZone from './CreateZone';
import UpdateZone from './UpdateZone';

const { Search } = Input;

const Zone = () => {
    const token = getToken();
    const navigate = useNavigate();
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const storeID = useParams();

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
        sortBy: 'id',
        descending: false,
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const columns = [
        { title: 'Tên Khu', dataIndex: 'name', key: 'name', width: '15%' },
        { title: 'Phân Khu', dataIndex: 'location', key: 'location', width: '10%', sorter: true },
        { title: 'Tên Sản Phẩm', dataIndex: 'productName', key: 'productName', width: '15%' },
        { title: 'Thông Tin Sản Phẩm', dataIndex: 'productInformation', key: 'productInformation', width: '30%' },
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

    const getZoneParams = (params, searchValue) => {
        const { pagination, sortBy, descending } = params;
        let query = `storeID=${storeID.id}&page=${pagination.current - 1}&size=${pagination.pageSize}`;
        if (sortBy) query += `&sortBy=${sortBy}&descending=${descending}`;
        if (searchValue) query += `&zoneName=${encodeURIComponent(searchValue)}`;
        return query;
    };

    const fetchZones = async () => {
        setLoading(true);
        try {
            const queryParams = '?' + getZoneParams(tableParams, searchValue);
            const response = await getDataWithToken(API.STORE_DETAIL.GET_STORE_ZONES + queryParams, token);
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
    }, [tableParams.pagination.current, tableParams.pagination.pageSize, tableParams.sortBy, tableParams.descending, searchValue]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams((prev) => ({
            ...prev,
            pagination,
            sortBy: sorter.field || 'id',
            descending: sorter.order === 'descend',
        }));
    };

    return (
        <div>
            <Button className="btn-create" title="Thêm zone mới" onClick={() => setIsCreateModalOpen(true)}>
                Thêm mới
            </Button>
            <Search
                placeholder="Nhập tên khu..."
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
                pagination={{ ...tableParams.pagination, showSizeChanger: true ,pageSizeOptions: ['5', '10', '20']}}
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
                <Modal title="Thêm Khu Mới" open={isCreateModalOpen} onCancel={() => setIsCreateModalOpen(false)} footer={null}>
                    <CreateZone onClose={() => setIsCreateModalOpen(false)} storeID={storeID.id} fetchZones={fetchZones} />
                </Modal>
                {/* Modal cập nhật */}
                <Modal title="Cập Nhật Khu" open={isUpdateModalOpen} onCancel={() => setIsUpdateModalOpen(false)} footer={null}>
                    {selectedZone && <UpdateZone zone={selectedZone} onClose={() => setIsUpdateModalOpen(false)} fetchZones={fetchZones} />}
                </Modal>
            </Flex> 
        </div>
    );
};

export default Zone;