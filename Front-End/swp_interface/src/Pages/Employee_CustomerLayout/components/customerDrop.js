import React, { useState, useEffect } from 'react';
import { Dropdown, Space, Button } from 'antd';
import { DownOutlined, PlusCircleOutlined, Modal } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Color } from 'antd/es/color-picker';
import CustomerIN4Create from './customerCreate';

const DropDown = ({ refreshData }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);
    const items = [
        {
            key: '1',
            label: (
                <Button
                    style={{ color: "#6B7012" }}
                    icon={<PlusCircleOutlined />}
                    type="link"
                    onClick={openModal} // Gọi hàm mở Modal
                >
                    Tạo Mới Khách Hàng
                </Button>
            ),
        },
    ];

    return (
        <>
            <Dropdown
                menu={{
                    items,
                }}
                trigger={['click']}
            >
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <span style={{ color: "#6B7012" }}>Chức Năng Nâng Cao</span>
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
            <CustomerIN4Create
                isVisible={isModalVisible}
                closeModal={closeModal}
                refreshData={refreshData}
            />
        </>
    );
};

export default DropDown;