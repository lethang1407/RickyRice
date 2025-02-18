import './style.scss';
import { Form, Input, Button, message, Statistic  } from 'antd';
import { UserOutlined} from '@ant-design/icons'
import { useNavigate  } from 'react-router-dom';
import { checkValid, fetchDataWithoutToken } from '../../Utils/FetchUtils';
import { useState } from 'react';
import { success, error } from '../../Utils/AntdNotification';
import API from '../../Utils/API/API.js';
import Loading from '../Loading/Loading';
function ForgetPassword(){
  const [loading,setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [acc, setAcc] = useState(null);
  const navigate = useNavigate();
  const [checkOTP, setCheckOTP] = useState(false);
  const [OTP, setOTP] = useState(null);
  const [next, setNext] = useState(false);
  const { Countdown } = Statistic;
  const [deadline, setDeadline] = useState(Date.now() + 1000*300);

  const handleChangeValues = (changedValues, allValues) =>{
    setAcc({
      username: allValues.key
    })
  }

  const handleChangeOTP = (text)=>{
    const string = text.reduce((acc, c) => acc + c, '');
    if(string.length === 6){
      setOTP(string);
    }
  }

  const handleNextToChange = async () =>{
    if(OTP){
      const res = await checkValid(API.AUTH.CHECK_OTP,{username: acc.username, OTP: OTP});
      if(res && res.code===200){
        if(res.data===true){
          setNext(true);
        }else{
          error('OTP is Invalid! Please try again', messageApi);
        }
      }
    }else{
      error('OTP is required!', messageApi);
    }
  }

  const handleChangePassword = async (values) => {
    const data = {
      username: acc.username,
      OTP: OTP,
      newPassword: values.password
    }
    setLoading(true);
    const res = await checkValid(API.AUTH.CHANGE_PASSWORD,data);
    setTimeout(()=>{
      if(res && res.code===200){
        success('Password has been changed! Please login again.', messageApi);
      }else{
        error('Failed to change password!', messageApi);
      }
      setTimeout(()=>{
        setLoading(false);
        navigate('/login');
      },1000)
    },1000)
  }

  const sendOTP = async (values) => {
    setLoading(true);
    const res = await fetchDataWithoutToken(API.AUTH.SEND_OTP(values.key));
    setLoading(false);
    if(res && res.code===200){
      if(res.data.isValid){
        success('OTP has been sent! Please check your Mail', messageApi);
        setAcc(res.data);
        setCheckOTP(true);
        setDeadline(Date.now() + 1000*300);
      }else{
        error('Username or Email is invalid!', messageApi);
      }
    }else{
      error('Failed to send email!', messageApi);
    }
  }

  const handleCountDown = () => {
    setCheckOTP(false);
    error('OTP has expired! Please try again.', messageApi);
  }

  const handleBack = () =>{
    setNext(false);
    setAcc(null);
    setOTP(null);
    setCheckOTP(false);
  }

  const naviLogin = () =>{
    navigate('/login');
  }

  const naviRegister = () =>{
    navigate('/register');
  }

  return (
    <>
      <div className="forgot">
        {loading && <Loading/>}
        {contextHolder}
        {
          next ? 
          <>
            <div className='forgot__overlay'></div>
            <div className='forgot__form'>
              <h2 className='forgot__title'>Change Password</h2>
              <h5 className='forgot__slogan'>Join Us Today and Start Your Journey to Success!</h5>
              <Form onFinish={handleChangePassword}>
                <Form.Item
                    name="password"
                    className='register__form__item'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your new password!',
                      }
                    ]}
                  >

                    <Input.Password size='large' className='register__form__item__input register__form__item__input__pass' placeholder='Input new password'/>
                </Form.Item>

                <Form.Item
                  name="passwordagain"
                  className='register__form__item'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your new password again!',
                    },({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    })
                  ]}
                >
                  <Input.Password size='large' className='register__form__item__input register__form__item__input__pass' placeholder='Input password new again'/>
                </Form.Item>
                  
                <div style={{display:'flex', alignItems:'center',justifyContent:'center'}}>
                  <Form.Item style={{margin:'20px 5px 20px 5px'}} className='forgot__form__b'>
                    <Button className='forgot__form__b__button' onClick={handleBack} >Try again
                    </Button>
                  </Form.Item>
                  <Form.Item style={{margin:'20px 5px 20px 5px'}} className='forgot__form__b'>
                    <Button className='forgot__form__b__button'  htmlType="submit" >Change
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </> 
          : 
          <>
            <div className='forgot__overlay'></div>
            <div className='forgot__form'>
              <h2 className='forgot__title'>Forgot Password</h2>
              <h5 className='forgot__slogan'>Join Us Today and Start Your Journey to Success!</h5>
              <Form 
                onValuesChange={handleChangeValues}
                initialValues={{
                  remember: false, 
                }}
                onFinish={sendOTP}
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
                  <Input disabled={checkOTP} size='large' placeholder='Input your Username or Email' className='forgot__form__item__input forgot__form__item__input__mail' addonAfter={<UserOutlined />}/>
                </Form.Item>

                <Form.Item
                  name="otp"
                  className='forgot__form__item'
                  style={{
                    textAlign: 'center'
                  }}
                >
                  <Input.OTP onInput={handleChangeOTP}/>
                  </Form.Item>

                  { checkOTP  && 
                    <>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <p style={{color:'orangered', margin:'0px'}}>OTP has been sent. OTP will be invalidated in:  </p><Countdown onFinish={handleCountDown} value={deadline}/>
                      </div>
                    </>
                  }
                  { !checkOTP && 
                    <>
                      <h5 className='forgot__form__text'>Don't have an account. <span onClick={naviRegister} className='forgot__form__text__bold'>Register here!</span></h5>
                      <h5 style={{margin:'5px 0px'}} className='forgot__form__text'>Remember your password. <span onClick={naviLogin} className='forgot__form__text__bold'> Login here!</span></h5>
                    </>
                  }
                  
                <div style={{display:'flex', alignItems:'center',justifyContent:'center'}}>
                  <Form.Item style={{margin:'20px 5px 20px 5px'}} className='forgot__form__b'>
                    <Button className='forgot__form__b__button' disabled={checkOTP} htmlType="submit">Send OTP
                    </Button>
                  </Form.Item>
                  <Form.Item style={{margin:'20px 5px 20px 5px'}} className='forgot__form__b'>
                    <Button className='forgot__form__b__button' disabled={!checkOTP} onClick={handleNextToChange} >Submit
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </>
        }
      </div>
    </>
  )
}

export default ForgetPassword;