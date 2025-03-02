import React from 'react';
import { Dropdown, Space, Button } from 'antd';
import { DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Color } from 'antd/es/color-picker';

const DropDown = () => {
    const navigate = useNavigate();

    const items = [
        {
            key: '1',
            label: (
                <Button style={{ color: "#6B7012" }} icon={<PlusCircleOutlined />}
                    type="link"
                    onClick={() => navigate('/employee/customers/create')}
                >
                    Tạo Mới Customer
                </Button>
            ),
        },

    ];

    return (
        <Dropdown
            menu={{
                items,
            }}
            trigger={['click']}
        >
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    <span style={{ color: "#6B7012" }}>Chức Năng Nâng Cao
                        <DownOutlined /></span>
                </Space>
            </a>
        </Dropdown>
    );
};

export default DropDown;