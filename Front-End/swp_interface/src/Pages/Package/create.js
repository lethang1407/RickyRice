import { Form, InputNumber, message, Button, Input } from "antd";
import Loading from "../Loading/Loading";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { error, success } from "../../Utils/AntdNotification";
import axios from "axios";
import { getToken } from "../../Utils/UserInfoUtils";
import { useParams } from "react-router-dom";

function Create(props){
  const { handleCloseModal, handleOpenModel} = props;
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const token = getToken();
  const storeID = useParams();

  const handleFinish = async (values) =>{
    try{
      const response = await axios.post('http://localhost:9999/package', {...values, storeId: storeID.id}, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
        },
      });
      success('Thêm quy cách đóng gói thành công!', messageApi);
      setTimeout(()=>{
        form.resetFields();
        handleCloseModal();
      },1000)
    }catch(err){
      error(err.response.data.message, messageApi);
    }
}

  return (
    <>
     {loading && <Loading />}
      {contextHolder}
        <Form 
        onFinish={handleFinish}
        form={form}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 16,
        }}>
          <Form.Item
            label="Tên"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên!" },
              { max: 1000, message: 'Mô tả không được vượt quá 50 ký tự!' },
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
            <Input style={{ width: "100%" }} placeholder="Nhập tên" />
          </Form.Item>

          <Form.Item
            label="Số kg/bao"
            name="quantity"
            rules={[
              { required: true, message: "Vui lòng nhập số kg/bao!" },
              { type: "number", min: 1, message: "Số lượng phải lớn hơn 0!" },
              { type: "number", max: 1000000, message: "Số lượng phải nhỏ hơn 1.000.000.000!" }
            ]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Nhập số kg/bao" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { max: 1000, message: 'Mô tả không được vượt quá 1000 ký tự!' },
              {
                validator: (_, value) => {
                  if (value && value.trim().length === 0) {
                    return Promise.reject(new Error('Mô tả không được chỉ chứa khoảng trắng!'));
                  }
                  return Promise.resolve();
                },
              }
            ]}
          >
            <TextArea rows={5} style={{ width: "100%" }} placeholder="Nhập mô tả" />
          </Form.Item>

          <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Form.Item>
              <Button style={{margin:'0px 10px'}} type="primary">
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