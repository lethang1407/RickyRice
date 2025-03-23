import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Spin, message } from 'antd';
import ChartComponent from '../../../Components/StoreOwner/ChartComponent/ChartComponent';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import { getToken } from '../../../Utils/UserInfoUtils';
import API from '../../../Utils/API/API';
import './style.scss';

const StatisticChart = () => {
    const [stores, setStores] = useState([]);
    const [selectedStores, setSelectedStores] = useState(['all']);
    const [storeStats, setStoreStats] = useState({
        totalEmployees: 0,
        totalProducts: 0,
        totalImport: 0,
        totalExport: 0,
        totalTransactions: 0,
    });
    const [loading, setLoading] = useState(false);
    const [loadingStores, setLoadingStores] = useState(true);
    const token = getToken();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setLoadingStores(true);
            try {
                const storesResponse = await getDataWithToken(
                    `${API.STORE_OWNER.GET_ALL_STORES}`,
                    token
                );
                setStores(storesResponse);
                setLoadingStores(false);

                let storeIdsParam;
                if (selectedStores.includes('all')) {
                    storeIdsParam = storesResponse.map(store => store.id).join(',');
                } else {
                    storeIdsParam = selectedStores.join(',');
                }

                if (storeIdsParam) {
                    const transactionsRes = await getDataWithToken(
                        `${API.STORE_OWNER.GET_STORE_TRANSACTIONS}?storeIds=${storeIdsParam}`,
                        token
                    );

                    setStoreStats({
                        totalEmployees: transactionsRes.totalEmployees,
                        totalProducts: transactionsRes.totalProducts,
                        totalImport: transactionsRes.totalImport || 0,
                        totalExport: transactionsRes.totalExport || 0,
                        totalTransactions: transactionsRes.totalTransactions,
                    });
                }
            } catch (error) {
                message.error(`Lỗi: ${error.message || 'Không thể tải dữ liệu'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedStores, token]);

    const storeOptions = [
        { value: 'all', label: 'Tất cả cửa hàng'},
        ...stores.map(store => ({
            value: store.id,
            label: store.name
        })),
    ];

    return (
        <div className="statistic-chart-page">
            <div className="store-selector">
                <Select
                    mode="multiple"
                    value={selectedStores}
                    onChange={setSelectedStores}
                    options={storeOptions}
                    style={{ width: '100%', marginBottom: 16 }}
                    placeholder="Chọn cửa hàng"
                    maxTagCount="responsive"
                    loading={loadingStores}
                />
            </div>

            <Row gutter={[16, 16]} className="store-stats">
                <Col xs={24} sm={12} md={12} lg={6} xl={4}>
                    <Card className="stat-card employees">
                        <div className="stat-title">Tổng nhân viên</div>
                        <div className="stat-value">
                            {loading ? <Spin /> : storeStats.totalEmployees}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={4}>
                    <Card className="stat-card products">
                        <div className="stat-title">Tổng sản phẩm</div>
                        <div className="stat-value">
                            {loading ? <Spin /> : storeStats.totalProducts}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={4}>
                    <Card className="stat-card import">
                        <div className="stat-title">Tổng nhập</div>
                        <div className="stat-value">
                            {loading ? (
                                <Spin />
                            ) : (
                                storeStats.totalImport.toLocaleString('vi-VN') + ' ₫'
                            )}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={4}>
                    <Card className="stat-card export">
                        <div className="stat-title">Tổng xuất</div>
                        <div className="stat-value">
                            {loading ? (
                                <Spin />
                            ) : (
                                storeStats.totalExport.toLocaleString('vi-VN') + ' ₫'
                            )}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={4}>
                    <Card className="stat-card transactions">
                        <div className="stat-title">Tổng giao dịch</div>
                        <div className="stat-value">
                            {loading ? <Spin /> : storeStats.totalTransactions}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <Card
                        title="Thống kê theo loại giao dịch"
                        bordered={false}
                        className="statistic-card"
                        loading={loading}
                    >
                        <ChartComponent
                            apiUrl={`${API.STORE_OWNER.GET_STORE_STATISTIC_CHART}/by-description`}
                            storeIds={
                                selectedStores.includes('all')
                                    ? stores?.map(store => store.id) ?? []
                                    : selectedStores
                            }
                        />
                    </Card>
                </Col>
                <Col span={24}>
                    <Card
                        title="Thống kê theo trạng thái thanh toán"
                        bordered={false}
                        className="statistic-card"
                        loading={loading}
                    >
                        <ChartComponent
                            apiUrl={`${API.STORE_OWNER.GET_STORE_STATISTIC_CHART}/by-type`}
                            storeIds={
                                selectedStores.includes('all')
                                    ? stores?.map(store => store.id) ?? []
                                    : selectedStores
                            }
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
export default StatisticChart;