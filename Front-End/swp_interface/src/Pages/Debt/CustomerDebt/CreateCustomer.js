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
        rules={[{ required: true, message: "Vui lòng nhập tên!" },
          {
            pattern: /^[A-Za-zÀ-ỹà-ỹ\s']{2,50}$/,
            message: 'Tên chỉ được chứa chữ cái và khoảng trắng (2–50 ký tự)!',
          },
          {
            validator: (_, value) => {
              if (value && value.trim().length === 0) {
                return Promise.reject(new Error('Tên không được chỉ chứa khoảng trắng!'));
              }
              return Promise.resolve();
            },
          }
        ]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phoneNumber"
        rules={[{ required: true, message: "Vui lòng số điện thoại!" },
          { 
            pattern: /^(0[3|5|7|8|9])(\d{8})$/,
            message: 'Số điện thoại không đúng định dạng!'
          }
        ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item label="Email" name="email"
          rules={[
            { 
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Email không đúng định dạng!'
            }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address"
          rules={[
            {
              pattern: /^[A-Za-zÀ-ỹà-ỹ\s']{2,200}$/,
              message: 'Địa chỉ được chứa chữ cái và khoảng trắng (2–200 ký tự)!',
            },
            {
              validator: (_, value) => {
                if (value && value.trim().length === 0) {
                  return Promise.reject(new Error('Địa chỉ không được chỉ chứa khoảng trắng!'));
                }
                return Promise.resolve();
              },
            }
            
          ]}
        >
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