import React from 'react';
import { Layout, Button } from 'antd';
import InvoiceDetail from './invoiceDetail';
import '../styleInvoices.css'

const { Content } = Layout;

const InvoiceCreate = () => {
    return (
        <Layout style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column' }}>
            {/* Phần trên: Thông tin hóa đơn */}
            <Content className='content_upper' style={{
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRight: '1px solid black',
                borderTop: '1px solid black',
                borderLeft: '1px solid black',
            }}>
                <InvoiceDetail />
            </Content>
        </Layout>
    );
};

export default InvoiceCreate;