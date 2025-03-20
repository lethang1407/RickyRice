import { Form, Button, Input, message } from "antd";
import { useEffect, useState } from "react";
import { getDataWithToken } from '../../../Utils/FetchUtils';
import { getToken, getUsername } from '../../../Utils/UserInfoUtils';
import axios from 'axios';
import { success, error } from "../../../Utils/AntdNotification";

function Update(props){
  const token = getToken();
  const { id, cancelUpdate } = props;
  const [customer,setCustomer] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const getCustomer = async () =>{
    const response = await getDataWithToken(`http://localhost:9999/debt/customer/${id}`, token);
    setCustomer(response.data);
  }

  const handleFinish = async (values) => {
    try{
      const response = await axios.put(`http://localhost:9999/debt/customer/${id}`, values, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
        },
      })
      success('Cập nhật thông tin thành công', messageApi);
      setTimeout(()=>{
        cancelUpdate();
      },1000)
    }catch(err){
      error(err.response.data.message, messageApi);
    }
  }

  useEffect(()=>{
    getCustomer();
  },[])

  return (
    <>
      {contextHolder}
      {
        customer && (
          <Form 
            initialValues={customer}
            onFinish={handleFinish}
            layout="horizontal"
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 16,
            }}>
              <Form.Item label="Tên" name="name">
                <Input placeholder="Nhập tên" />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>

              <Form.Item label="Tổng nợ" name="balance">
                <Input disabled placeholder="" />
              </Form.Item>

              <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Form.Item>
                  <Button onClick={cancelUpdate} style={{margin:'0px 10px'}} type="primary">
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
        )
      }
    </>
  )
}

export default Update;