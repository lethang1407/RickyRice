import { Form, Input, Button, InputNumber, Select, notification  } from "antd";
import { addNewResource } from "../../../Utils/FetchUtils";
import { getToken } from "../../../Utils/UserInfoUtils";

function Create(props){
  const token = getToken();
  const { customer, id, setCreate, setCreateId } = props;
  const [form] = Form.useForm();
  const handleFinish = async (values) =>{
    const response = await addNewResource('http://localhost:9999/debt', {...values, customerId: id}, token);
    if(response){
      form.resetFields();
      setCreateId(null);
      setCreate(false);
    }
  }

  const handleCancel = () => {
    form.resetFields();
    setCreateId(null);
    setCreate(false);
  }

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
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Số tiền"
          name="amount"
          rules={[
            { required: true, message: "Vui lòng nhập số tiền!" },
            { type: "number", min: 1, message: "Số tiền phải lớn hơn 0!" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="Nhập số tiền" />
        </Form.Item>

        <Form.Item
          label="Loại giao dịch"
          name="type"
          rules={[{ required: true, message: "Vui lòng nhập loại giao dịch!" }]}
        >
          <Select options={options}/>
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Nhập mô tả (nếu có)" />
        </Form.Item>

        <Form.Item label="Hình ảnh" name="image">
          <Input placeholder="Nhập URL hình ảnh (nếu có)" />
        </Form.Item>

        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Form.Item>
            <Button onClick={handleCancel} style={{margin:'0px 10px'}} type="primary">
              Hủy 
            </Button>
          </Form.Item>
          <Form.Item>
            <Button style={{margin:'0px 10px'}} type="primary" htmlType="submit">
              Gửi
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  )
}

export default Create;