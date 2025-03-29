import React from 'react';
import { Form, Input, Row, Col, DatePicker } from 'antd';
import dayjs from 'dayjs';

function Filter(props) {
    const { params, setParams } = props;

    // Hàm xử lý khi form thay đổi
    const onFormChange = (changedValues, allValues) => {
        // Lọc các giá trị không null, không undefined, và không rỗng
        const filterParams = Object.fromEntries(
            Object.entries(allValues).filter(
                ([_, value]) =>
                    value !== undefined &&
                    value !== null &&
                    (typeof value !== 'string' || value.trim() !== '')
            )
        );

        if (filterParams.fromCreatedAt) {
            filterParams.fromCreatedAt = dayjs(filterParams.fromCreatedAt).format('YYYY-MM-DD');
        }
        if (filterParams.toCreatedAt) {
            filterParams.toCreatedAt = dayjs(filterParams.toCreatedAt).format('YYYY-MM-DD');
        }
        if (filterParams.fromUpdatedAt) {
            filterParams.fromUpdatedAt = dayjs(filterParams.fromUpdatedAt).format('YYYY-MM-DD');
        }
        if (filterParams.toUpdatedAt) {
            filterParams.toUpdatedAt = dayjs(filterParams.toUpdatedAt).format('YYYY-MM-DD');
        }

        const queryString = new URLSearchParams(filterParams).toString();
        setParams(queryString); 
    };

    return (
        <Form onValuesChange={onFormChange} name="filter" layout="vertical">
            <Row gutter={16}>
                <Col span={3}>
                    <Form.Item label="Tên sản phẩm" name="name">
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item label="Giá từ" name="fromPrice">
                        <Input placeholder="Giá từ" type='number' />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item label="Giá đến" name="toPrice">
                        <Input placeholder="Giá đến" type='number' />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item label="Thông tin sản phẩm" name="information">
                        <Input placeholder="Nhập thông tin" />
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item label="Ngày tạo từ" name="fromCreatedAt">
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item label="Ngày tạo đến" name="toCreatedAt">
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item label="Ngày cập nhật từ" name="fromUpdatedAt">
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item label="Ngày cập nhật đến" name="toUpdatedAt">
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

export default Filter;