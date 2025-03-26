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
    
      const queryString = new URLSearchParams(filterParams).toString();
      console.log(queryString);
      setParams(queryString);
    };

    const options = [
      {
        value: 'POSITIVE_KH_TRA',
        label: 'Khách hàng trả cửa hàng',
      },
      {
        value: 'POSITIVE_CH_VAY',
        label: 'Cửa hàng vay khách hàng',
      },
      {
        value: 'NEGATIVE_KH_VAY',
        label: 'Khách hàng vay cửa hàng',
      },
      {
        value: 'NEGATIVE_CH_TRA',
        label: 'Cửa hàng trả khách hàng',
      }
      ];

    return (
      <>
      <Form onValuesChange={onFormChange} name="basic" layout="vertical">
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label="Mã số nợ" name="number">
              <Input />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label="Loại nợ" name="type">
              <Select allowClear options={options}/>
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label="Số tiền từ" name="fromAmount">
              <Input type='number'/>
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label="Số tiền tới" name="toAmount">
              <Input type='number'/>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label="Khách hàng" name="customerName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label="Cửa hàng" name="storeId">
              <Select allowClear options={store}/>
            </Form.Item>
          </Col>

          <Col span={2}>
            <Form.Item label="Được tạo bởi" name="createdBy">
              <Input />
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
        </Row>
      </Form>
    </>
  )
}

export default Filter;