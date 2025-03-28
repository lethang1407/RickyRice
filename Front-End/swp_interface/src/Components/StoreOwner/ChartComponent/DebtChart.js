import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getDataWithToken } from '../../../Utils/FetchUtils';
import { getToken } from '../../../Utils/UserInfoUtils';
import { message, Spin, Card, Row, Col, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import API from '../../../Utils/API/API';
import './style.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CHART_COLORS = {
    'Nợ': {
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)'
    }
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};

const DebtChart = ({ storeIds }) => {
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date()
    });
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({
        transactionCount: 0,
        totalAmount: 0
    });
    const token = getToken();
    const apiUrl = API.STORE_OWNER.GET_STORE_STATISTIC_CHART + '/by-debt'

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Thống kê nợ',
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw)}`
                }
            }
        },
        scales: {
            x: {
                title: { display: true, text: 'Ngày' },
                grid: { display: false }
            },
            y: {
                title: { display: true, text: 'Số tiền (VNĐ)' },
                beginAtZero: true,
                ticks: { callback: value => formatCurrency(value) }
            }
        }
    };

    const calculateSummary = useCallback((data) => {
        let totalAmount = 0;
        let transactionCount = 0;
        Object.entries(data).forEach(([, amount]) => {
            if (typeof amount === 'number') {
                totalAmount += amount;
                transactionCount++;
            }
        });
        return { transactionCount, totalAmount };
    }, []);

    const prepareChartData = useCallback((data) => {
        const labels = Object.keys(data).sort();
        const datasets = [{
            label: 'Nợ',
            data: labels.map(date => data[date] || 0),
            ...CHART_COLORS['Nợ'],
        }];
        return { labels, datasets };
    }, []);

    const fetchChartData = useCallback(async () => {
        const { startDate, endDate } = dateRange;
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        setLoading(true);
        try {
            const storeParam = storeIds && !storeIds.includes('all')
                ? `&storeIds=${storeIds.join(',')}`
                : '';

            const response = await getDataWithToken(
                `${apiUrl}?startDate=${formattedStartDate}&endDate=${formattedEndDate}${storeParam}`,
                token
            );

            const preparedData = prepareChartData(response);
            const summaryData = calculateSummary(response);
            setChartData(preparedData);
            setSummary(summaryData);

        } catch (error) {
            console.error("Error fetching data:", error);
            message.error(error.response ? `Lỗi: ${error.response.status}` : error.message);
            setChartData({ labels: [], datasets: [] });
            setSummary({ transactionCount: 0, totalAmount: 0 });
        } finally {
            setLoading(false);
        }
    }, [apiUrl, dateRange, token, prepareChartData, calculateSummary, storeIds]);

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    const handleDateChange = useCallback((type, date) => {
        setDateRange(prev => ({ ...prev, [type]: date }));
    }, []);

    const handleResetDates = useCallback(() => {
        setDateRange({
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            endDate: new Date()
        });
    }, []);

    return (
        <div className="chart-container">
            <div className="date-picker-row">
                <div className="date-inputs">
                    <div>
                        <label>Ngày bắt đầu: </label>
                        <DatePicker
                            selected={dateRange.startDate}
                            onChange={(date) => handleDateChange('startDate', date)}
                            dateFormat="dd/MM/yyyy"
                            maxDate={dateRange.endDate}
                        />
                    </div>
                    <div>
                        <label>Ngày kết thúc: </label>
                        <DatePicker
                            selected={dateRange.endDate}
                            onChange={(date) => handleDateChange('endDate', date)}
                            dateFormat="dd/MM/yyyy"
                            minDate={dateRange.startDate}
                        />
                    </div>
                </div>
                <div className="chart-controls">
                    <Button icon={<ReloadOutlined />} onClick={handleResetDates} type="default" className="reset-button">Đặt lại</Button>
                </div>
            </div>
            <Row gutter={[16, 16]} className="summary-section">
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="summary-card total">
                        <div className="summary-type">Tổng giao dịch</div>
                        <div className="summary-amount">{summary.transactionCount}</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="summary-card total-amount">
                        <div className="summary-type">Tổng tiền</div>
                        <div className="summary-amount">{formatCurrency(summary.totalAmount)}</div>
                    </Card>
                </Col>
            </Row>
            <div className="chart-wrapper">
                {loading ? <Spin size="large" /> : <Bar data={chartData} options={chartOptions} />}
            </div>
        </div>
    );
}
export default DebtChart;