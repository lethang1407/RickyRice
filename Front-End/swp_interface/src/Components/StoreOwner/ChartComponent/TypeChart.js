import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getDataWithToken } from '../../../Utils/FetchUtils';
import { getToken } from '../../../Utils/UserInfoUtils';
import { message, Spin, Card, Row, Col, Select, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import API from '../../../Utils/API/API';
import './style.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CHART_COLORS = {
    'Import': { backgroundColor: 'rgba(255, 99, 132, 0.5)', borderColor: 'rgb(255, 99, 132)' },
    'Export': { backgroundColor: 'rgba(53, 162, 235, 0.5)', borderColor: 'rgb(53, 162, 235)' }
};
const DEFAULT_COLOR = { backgroundColor: 'rgba(153, 102, 255, 0.5)', borderColor: 'rgb(153, 102, 255)' };

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const TypeChart = ({ storeIds }) => {
    const [dateRange, setDateRange] = useState({ startDate: new Date(new Date().setDate(new Date().getDate() - 7)), endDate: new Date() });
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ totals: {}, transactionCount: 0, totalAmount: 0 });
    const [selectedType, setSelectedType] = useState('all');
    const [filteredSummary, setFilteredSummary] = useState({ totals: {}, transactionCount: 0, totalAmount: 0 });
    const token = getToken();
    const apiUrl = API.STORE_OWNER.GET_STORE_STATISTIC_CHART + '/by-type';

    const selectOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'Import', label: 'Nhập Khẩu' },
        { value: 'Export', label: 'Xuất Khẩu' }
    ];

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Thống kê Import/Export', font: { size: 16 } },
            tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw)}` } }
        },
        scales: {
            x: { title: { display: true, text: 'Ngày' }, grid: { display: false } },
            y: {
                title: { display: true, text: 'Số tiền (VNĐ)' },
                beginAtZero: true,
                ticks: { callback: value => formatCurrency(value) }
            }
        }
    };

    const calculateSummary = useCallback((data) => {
        const totals = {};
        let transactionCount = 0;
        let totalAmount = 0;
        Object.values(data).forEach(dayData => {
            Object.entries(dayData).forEach(([type, amount]) => {
                totals[type] = (totals[type] || 0) + amount;
                totalAmount += amount;
                transactionCount++;
            });
        });
        return { totals, transactionCount, totalAmount };
    }, []);

    const prepareChartData = useCallback((data) => {
        const labels = Object.keys(data).sort();
        const allTypes = new Set();
        labels.forEach(date => Object.keys(data[date]).forEach(type => allTypes.add(type)));
        let filteredTypes = Array.from(allTypes);

        if (selectedType !== 'all') {
            filteredTypes = filteredTypes.filter(type => type === selectedType);
        }

        const datasets = filteredTypes.map(type => ({
            label: type,
            data: labels.map(date => data[date]?.[type] || 0),
            ...((CHART_COLORS[type] || DEFAULT_COLOR))
        }));

        return { labels, datasets };
    }, [selectedType]);

    const filterSummaryData = useCallback((summaryData, selectedType) => {
        if (selectedType === 'all') {
            return summaryData;
        }

        const filteredTotals = {
            [selectedType]: summaryData.totals[selectedType] || 0,
        };

        let filteredTransactionCount = 0;
        let filteredTotalAmount = 0;

        if(summaryData.totals[selectedType]){
            filteredTransactionCount = 1;
            filteredTotalAmount = summaryData.totals[selectedType];
        }

        return {
            totals: filteredTotals,
            transactionCount: filteredTransactionCount,
            totalAmount: filteredTotalAmount,
        };
    }, []);

    const fetchChartData = useCallback(async () => {
        const { startDate, endDate } = dateRange;
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        setLoading(true);
        try {
            const storeParam = storeIds && !storeIds.includes('all') ? `&storeIds=${storeIds.join(',')}` : '';
            const response = await getDataWithToken(`${apiUrl}?startDate=${formattedStartDate}&endDate=${formattedEndDate}${storeParam}`, token);
            const preparedData = prepareChartData(response);
            const summaryData = calculateSummary(response);
            setChartData(preparedData);
            setSummary(summaryData);
        } catch (error) {
            console.error("Error fetching data:", error);
            message.error(error.response ? `Lỗi: ${error.response.status}` : error.message);
            setChartData({ labels: [], datasets: [] });
            setSummary({ totals: {}, transactionCount: 0, totalAmount: 0 });
        } finally {
            setLoading(false);
        }
    }, [apiUrl, dateRange, token, prepareChartData, calculateSummary, storeIds]);

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    useEffect(() => {
        const newFilteredSummary = filterSummaryData(summary, selectedType);
        setFilteredSummary(newFilteredSummary);
    }, [summary, selectedType, filterSummaryData]);

    const handleDateChange = useCallback((type, date) => { setDateRange(prev => ({ ...prev, [type]: date })); }, []);
    const handleTypeChange = useCallback((value) => { setSelectedType(value || 'all'); }, []);
    const handleResetDates = useCallback(() => {
        const today = new Date();
        const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
        setDateRange({
            startDate: sevenDaysAgo,
            endDate: new Date()
        });
    }, []);

    return (
        <div className="chart-container">
            <div className="date-picker-row">
                <div className="date-inputs">
                    <div>
                        <label>Ngày bắt đầu: </label>
                        <DatePicker selected={dateRange.startDate} onChange={(date) => handleDateChange('startDate', date)} dateFormat="dd/MM/yyyy" maxDate={dateRange.endDate} />
                    </div>
                    <div>
                        <label>Ngày kết thúc: </label>
                        <DatePicker selected={dateRange.endDate} onChange={(date) => handleDateChange('endDate', date)} dateFormat="dd/MM/yyyy" minDate={dateRange.startDate} />
                    </div>
                </div>
                <div className="chart-controls">
                    <Select className="type-select" placeholder="Chọn loại" allowClear options={selectOptions} onChange={handleTypeChange} value={selectedType} style={{ width: 120 }} />
                    <Button icon={<ReloadOutlined />} onClick={handleResetDates} type="default" className="reset-button">Đặt lại</Button>
                </div>
            </div>
            <Row gutter={[16, 16]} className="summary-section">
                {Object.entries(filteredSummary.totals).map(([type, amount]) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={type}>
                        <Card className={`summary-card ${type.toLowerCase()}`}>
                            <div className="summary-type">{type}</div>
                            <div className="summary-amount">{formatCurrency(amount)}</div>
                        </Card>
                    </Col>
                ))}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="summary-card total">
                        <div className="summary-type">Tổng giao dịch</div>
                        <div className="summary-amount">{filteredSummary.transactionCount}</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="summary-card total-amount">
                        <div className="summary-type">Tổng tiền</div>
                        <div className="summary-amount">{formatCurrency(filteredSummary.totalAmount)}</div>
                    </Card>
                </Col>
            </Row>
            <div className="chart-wrapper">
                {loading ? <Spin size="large" /> : <Bar data={chartData} options={chartOptions} />}
            </div>
        </div>
    );
}

export default TypeChart;