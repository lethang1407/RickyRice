import { Col, Form, Input, InputNumber, Row } from "antd";

function Filter(props){
  const { params, setParams } = props;

  const onFormChange = (changedValues, allValues) => {
        const filterParams = Object.fromEntries(
          Object.entries(allValues).filter(
            ([_, value]) => value !== undefined && value !== null && 
            (typeof value !== 'string' || value.trim() !== '')
          )
        );
      
        const queryString = new URLSearchParams(filterParams).toString();
        setParams(queryString);
      };

  return (
    <>
      <Form onValuesChange={onFormChange} name="basic" layout="vertical">
        <Row gutter={16}>
            <Col span={4}>
              <Form.Item label="Tên" name="name">
                <Input type='text'/>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Số lượng" name="quantity">
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>
        </Form>
    </>
  )
}

export default Filter;