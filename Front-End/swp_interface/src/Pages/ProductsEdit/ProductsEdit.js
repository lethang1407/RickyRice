import React from 'react';
import { Dropdown, Space, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const DropDown = () => {
    const navigate = useNavigate();

    const items = [
        {
            key: '1',
            label: (
                <Button
                    type="link"
                // onClick={() => navigate('/employee/products/createproduct')}
                >
                    Add More Product
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
                    Add More Product
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    );
};

export default DropDown;