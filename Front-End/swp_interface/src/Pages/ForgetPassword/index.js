import './style.scss';
import { Form, Input, Button, message,Checkbox } from 'antd';
import { UserOutlined} from '@ant-design/icons'
import { useNavigate  } from 'react-router-dom';
import { fetchDataWithoutToken } from '../../Utils/FetchUtils';
import { useState } from 'react';
import { success, error } from '../../Utils/AntdNotification';
import Loading from '../Loading/Loading';
function ForgetPassword(){
  const [loading,setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [data,setData] = useState(null);

  const handleChangeValues = (changedValues, allValues) =>{
    setData({
      key: allValues.key,
      otp: allValues.otp
    })
  }

  const sendOTP = async (values) => {
    setLoading(true);
    const res = await fetchDataWithoutToken(`http://localhost:9999/send-otp/${values.key}`);
    setLoading(false);
    if(res && res.code===200){
      success('Email has been sent! Please check your Mail', messageApi);
    }else{
      error('Failed to send email!', messageApi);
    }
  }

  const handleChangePassword = async () =>{
    console.log(data)
  }

  return (
    <>
      <div className="forgot">
        {loading && <Loading/>}
        {contextHolder}
        <div className='forgot__overlay'></div>
        <div className='forgot__form'>
          <h2 className='forgot__title'>Forgot Password</h2>
          <h5 className='forgot__slogan'>Join Us Today and Start Your Journey to Success!</h5>
          <Form 
            initialValues={{
              remember: false, 
            }}
            onFinish={sendOTP}
            onValuesChange={handleChangeValues}
          >
            <Form.Item
              name="key"
              className='forgot__form__item'
              rules={[
                {
                  required: true,
                  message: 'Please input your username or email!',
                }
              ]}
              style={{marginTop:'20px'}}
            >
              <Input size='large' placeholder='Input your Username or Email' className='forgot__form__item__input forgot__form__item__input__mail' addonAfter={<UserOutlined />}/>
            </Form.Item>

            <Form.Item
              name="otp"
              className='forgot__form__item'
              style={{
                textAlign: 'center'
              }}
            >
              <Input.OTP />
              </Form.Item>

            <h5 className='forgot__form__text'>Don't have an account. <span className='forgot__form__text__bold'>Register here!</span></h5>
            <h5 style={{margin:'5px 0px'}} className='forgot__form__text'>Remember your password. <span  className='forgot__form__text__bold'> Login here!</span></h5>
            <div style={{display:'flex', alignItems:'center',justifyContent:'center'}}>
              <Form.Item style={{margin:'20px 5px 20px 5px'}} className='forgot__form__b'>
                <Button className='forgot__form__b__button' htmlType="submit">Send OTP
                </Button>
              </Form.Item>
              <Form.Item style={{margin:'20px 5px 20px 5px'}} className='forgot__form__b'>
                <Button className='forgot__form__b__button' onClick={handleChangePassword} >Submit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

export default ForgetPassword;