import React from 'react';
import { Dropdown, Space, Button } from 'antd';
import { DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const DropDown = () => {
    const navigate = useNavigate();

    const items = [
        {
            key: '1',
            label: (
                <Button icon={<PlusCircleOutlined />}
                    type="link"
                    onClick={() => navigate('/employee/customers/create')}
                >
                    Create New Customer
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
                    Customer Options
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    );
};

export default DropDown;