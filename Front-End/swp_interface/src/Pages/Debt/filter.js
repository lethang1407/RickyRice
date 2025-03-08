import { Button, Select, Form, Input, Row, Col, DatePicker } from 'antd';
function Filter(props){
    const { params, setParams } = props;
    const onFormChange = (changedValues, allValues) =>{
      const filterParams = Object.fromEntries(
        Object.entries(allValues).filter(([_, value]) => value !== undefined)
      );
      const queryString = new URLSearchParams(filterParams).toString();
      console.log(queryString);
      setParams(allValues)
    }
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
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label="Debt Number" name="number">
              <Input />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label="Debt Type" name="type">
              <Select options={options}/>
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label="Amount From" name="fromAmount">
              <Input type='number'/>
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label="Amount To" name="toAmount">
              <Input type='number'/>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Customer" name="customerName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Store" name="storeName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label="Created From" name="startCreatedAt">
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label="Created To" name="endCreatedAt">
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default Filter;