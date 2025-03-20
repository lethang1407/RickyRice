import { Button, Select, Form, Input, Row, Col, DatePicker } from 'antd';
import dayjs from 'dayjs';

function Filter(props){
    const { params, setParams, store } = props;
    
    const onFormChange = (changedValues, allValues) => {
      const filterParams = Object.fromEntries(
        Object.entries(allValues).filter(
          ([_, value]) => value !== undefined && value !== null && 
          (typeof value !== 'string' || value.trim() !== '')
        )
      );
    
      if (filterParams.startCreatedAt) {
        filterParams.startCreatedAt = dayjs(filterParams.startCreatedAt).format('YYYY-MM-DD');
      }
    
      if (filterParams.endCreatedAt) {
        filterParams.endCreatedAt = dayjs(filterParams.endCreatedAt).format('YYYY-MM-DD');
      }

      if (filterParams.startUpdatedAt) {
        filterParams.startUpdatedAt = dayjs(filterParams.startUpdatedAt).format('YYYY-MM-DD');
      }
    
      if (filterParams.endUpdatedAt) {
        filterParams.endUpdatedAt = dayjs(filterParams.endUpdatedAt).format('YYYY-MM-DD');
      }
    
      const queryString = new URLSearchParams(filterParams).toString();
      setParams(queryString);
    };

    const options = [
      {
        value: 'POSITIVE',
        label: 'Positive',
      },
      {
        value: 'NEGATIVE',
        label: 'Negative',
      }
      ];

    return (
      <>
      <Form onValuesChange={onFormChange} name="basic" layout="vertical">
        <Row gutter={20}>
          <Col span={5}>
            <Form.Item label="Khách hàng" name="customerName">
              <Input />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item label="Số điện thoại" name="phoneNumber">
              <Input />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item label="Địa chỉ" name="address">
              <Input />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Số tiền nợ từ" name="fromAmount">
              <Input type='number'/>
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Số tiền nợ tới" name="toAmount">
              <Input type='number'/>
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item label="Cửa hàng" name="storeId">
              <Select allowClear options={store}/>
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Được tạo từ" name="startCreatedAt">
              <DatePicker format="YYYY-MM-DD" 
                  onChange={(date, dateString) => console.log(dateString)}  
              />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Được tạo tới" name="endCreatedAt">
              <DatePicker format="YYYY-MM-DD" 
                  onChange={(date, dateString) => console.log(dateString)}  />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Được tạo bởi" name="createdBy">
              <Input />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Cập nhật khi" name="startUpdatedAt">
              <DatePicker format="YYYY-MM-DD" 
                  onChange={(date, dateString) => console.log(dateString)}  
              />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Cập nhật tới" name="endUpdatedAt">
              <DatePicker format="YYYY-MM-DD" 
                  onChange={(date, dateString) => console.log(dateString)}  />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Cập nhật bởi" name="updatedBy">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default Filter;