import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Select, Spin, message } from 'antd';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import { getToken } from '../../../Utils/UserInfoUtils';
import API from '../../../Utils/API/API';
import './style.scss';
import TypeChart from '../../../Components/StoreOwner/ChartComponent/TypeChart';
import DebtChart from '../../../Components/StoreOwner/ChartComponent/DebtChart';
import DebtKHChart from '../../../Components/StoreOwner/ChartComponent/DebtKHChart';
import DebtCHChart from '../../../Components/StoreOwner/ChartComponent/DebtCHChart';

const { Option } = Select;

const StatisticChart = () => {
    const [stores, setStores] = useState([]);
    const [selectedStores, setSelectedStores] = useState([]);
    const [allStoreIds, setAllStoreIds] = useState([]);
    const [storeStats, setStoreStats] = useState({
        totalEmployees: 0,
        totalProducts: 0,
        totalImport: 0,
        totalExport: 0,
        totalTransactions: 0,
        totalDebtOfKH: 0,
        totalDebtOfCH: 0
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
                const ids = storesResponse.map(store => store.id);
                setAllStoreIds(ids);
                setSelectedStores(ids);
                setLoadingStores(false);
                let storeIdsParam = ids.join(',');
                if (storeIdsParam) {
                    const transactionsRes = await getDataWithToken(
                        `${API.STORE_OWNER.GET_STORE_TRANSACTIONS}?storeIds=${storeIdsParam}`,
                        token
                    );
                    console.log(transactionsRes);
                    
                    setStoreStats({
                        totalEmployees: transactionsRes.totalEmployees,
                        totalProducts: transactionsRes.totalProducts,
                        totalImport: transactionsRes.totalImport || 0,
                        totalExport: transactionsRes.totalExport || 0,
                        totalTransactions: transactionsRes.totalTransactions,
                        totalDebtOfKH: transactionsRes.totalDebtOfKH || 0,
                        totalDebtOfCH: transactionsRes.totalDebtOfCH || 0
                    });
                }
            } catch (error) {
                message.error(`Lỗi: ${error.message || 'Không thể tải dữ liệu'}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let storeIdsParam = selectedStores.join(',');
                if (!storeIdsParam) {
                    storeIdsParam = allStoreIds.join(',');
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
                        totalDebtOfKH: transactionsRes.totalDebtOfKH || 0,
                        totalDebtOfCH: transactionsRes.totalDebtOfCH || 0
                    });
                }
                else {
                    setStoreStats({
                        totalEmployees: 0,
                        totalProducts: 0,
                        totalImport: 0,
                        totalExport: 0,
                        totalTransactions: 0,
                        totalDebtOfKH: 0,
                        totalDebtOfKH: 0
                    });
                }
            } catch (error) {
                message.error(`Lỗi: ${error.message || 'Không thể tải dữ liệu'}`);

            } finally {
                setLoading(false);
            }
        }
        fetchData();

    }, [selectedStores, allStoreIds])
    const handleStoreChange = (value) => {
        if (value.length === 0) {
            setSelectedStores(allStoreIds);
        } else {
            setSelectedStores(value);
        }
    };
    return (
        <div className="statistic-chart-page">
            <div className="store-selector">
                <Select
                    mode="multiple"
                    value={selectedStores}
                    onChange={handleStoreChange}
                    style={{ width: '100%', marginBottom: 16 }}
                    placeholder="Chọn cửa hàng"
                    maxTagCount="responsive"
                    loading={loadingStores}
                    className="custom-select"
                    allowClear
                >
                    {stores.map((store) => (
                        <Option key={store.id} value={store.id}>
                            {store.name}
                        </Option>
                    ))}
                </Select>
            </div>
            <Row gutter={[16, 16]} className="store-stats">
                <Col xs={24} sm={12} md={12} lg={6} xl={4}>
                    <Card className="stat-card debt">
                        <div className="stat-title">Tổng sản phẩm</div>
                        <div className="stat-value">
                            {loading ? <Spin /> : storeStats.totalProducts}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={4}>
                    <Card className="stat-card debt">
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
                    <Card className="stat-card debt">
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
                    <Card className="stat-card debt">
                        <div className="stat-title">Tổng giao dịch</div>
                        <div className="stat-value">
                            {loading ? <Spin /> : storeStats.totalTransactions}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={4}>
                    <Card className="stat-card debt">
                        <div className="stat-title">Tổng Khách Hàng nợ</div>
                        <div className="stat-value">
                            {loading ? (
                                <Spin />
                            ) : (
                                (storeStats.totalDebtOfKH || 0).toLocaleString('vi-VN') + ' ₫'
                            )}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={4}>
                    <Card className="stat-card debt">
                        <div className="stat-title">Tổng Cửa Hàng nợ</div>
                        <div className="stat-value">
                            {loading ? (
                                <Spin />
                            ) : (
                                (storeStats.totalDebtOfCH || 0).toLocaleString('vi-VN') + ' ₫'
                            )}
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
                        <TypeChart
                            storeIds={selectedStores}
                        />
                    </Card>
                </Col>
                <Col span={24}>
                    <Card
                        title="Thống kê khách hàng nợ"
                        bordered={false}
                        className="statistic-card"
                        loading={loading}
                    >
                        <DebtKHChart
                            storeIds={selectedStores}
                        />
                    </Card>
                </Col>
                <Col span={24}>
                    <Card
                        title="Thống kê cửa hàng nợ"
                        bordered={false}
                        className="statistic-card"
                        loading={loading}
                    >
                        <DebtCHChart
                            storeIds={selectedStores}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
export default StatisticChart;