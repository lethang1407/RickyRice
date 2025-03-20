import { Form, Button, Input, Select, message } from "antd";
import axios from "axios";
import { getToken } from "../../../Utils/UserInfoUtils";
import { success, error } from "../../../Utils/AntdNotification";
function CreateCustomer(props){
  const { store, setCreateCustomer } = props;
  const token = getToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const handleFinish = async (values) =>{
      try{
        const response = await axios.post('http://localhost:9999/debt/customer', values, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, 
          },
        });
        success('Thêm khách hàng thành công!', messageApi);
        setTimeout(()=>{
          form.resetFields();
          setCreateCustomer(false);
        },1000)
      }catch(err){
        error(err.response.data.message, messageApi);
      }
  }

  return (
    <>
      {contextHolder}
      <Form 
      form={form}
      onFinish={handleFinish}
      layout="horizontal"
      labelCol={{
        span: 5,
      }}
      wrapperCol={{
        span: 16,
      }}>
        <Form.Item label="Tên" name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phoneNumber"
        rules={[{ required: true, message: "Vui lòng số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          label="Cửa hàng"
          name="storeId"
          rules={[{ required: true, message: "Vui lòng chọn cửa hàng!" }]}
        >
          <Select options={store}/>
        </Form.Item>

        <Form.Item label="Tổng nợ">
          <Input defaultValue={0} disabled placeholder="" />
        </Form.Item>

        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Form.Item>
            <Button onClick={() => {form.resetFields(); setCreateCustomer(false);}} style={{margin:'0px 10px'}} type="primary">
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

export default CreateCustomer;