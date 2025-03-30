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
      username: allValues.key.trim().toLowerCase()
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
      const res = await checkValid(API.AUTH.CHECK_OTP,{username: acc.username.trim().toLowerCase(), OTP: OTP});
      if(res && res.code===200){
        console.log(res);
        if(res.data.valid===true){
          setNext(true);
        }else{
          if(res.data.times < 3){
            error('OTP không tồn tại, Hãy thử lại', messageApi);
          }else{
            error('Vượt quá số lần điền OTP! Hãy thử lại sau', messageApi);
            setTimeout(()=>{
              navigate('/login');
            },1000)
          }
        }
      }else{
        error('OTP không tồn tại, Hãy thử lại', messageApi);
      }
    }else{
      error('Vui lòng điền OTP!', messageApi);
    }
  }

  const handleChangePassword = async (values) => {
    const data = {
      username: acc.username.trim().toLowerCase(),
      OTP: OTP,
      newPassword: values.password
    }
    setLoading(true);
    const res = await checkValid(API.AUTH.CHANGE_PASSWORD,data);
    setTimeout(()=>{
      if(res && res.code===200){
        success('Mật khẩu đã được thay đổi! Hãy đăng nhập.', messageApi);
      }else{
        error('Đổi mật khẩu thất bại', messageApi);
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
        success('OTP đã được gửi! Vui lòng kiểm tra Email', messageApi);
        setAcc(res.data);
        setCheckOTP(true);
        setDeadline(Date.now() + 1000*300);
      }else if(res.data.otpNotExpired){
        error('OTP đã được gửi! Vui lòng kiểm tra Email', messageApi);
      }
      else{
        error('Tên đăng nhập hoặc Email không tồn tạitại!', messageApi);
      }
    }else{
      error('Gửi email thất bại!', messageApi);
    }
  }

  const handleCountDown = () => {
    setCheckOTP(false);
    error('OTP đã hết hạn! Hãy thử lại.', messageApi);
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
              <h2 className='forgot__title'>ĐỔI MẬT KHẨU</h2>
              <h5 className='forgot__slogan'>Tham gia cùng chúng tôi và bắt đầu hành trình của bạn!</h5>
              <Form onFinish={handleChangePassword}>
                <Form.Item
                    name="password"
                    className='register__form__item'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng điền mật khẩu mới!',
                      },
                      {
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm ít nhất 1 chữ cái, 1 số và 1 ký tự đặc biệt!',
                      }
                    ]}
                  >

                    <Input.Password size='large' className='register__form__item__input register__form__item__input__pass' placeholder='Vui lòng điền mật khẩu'/>
                </Form.Item>

                <Form.Item
                  name="passwordagain"
                  className='register__form__item'
                  rules={[
                    {
                      required: true,
                      message: 'Kiểm tra mật khẩu!',
                    },({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu không trùng khớp!'));
                      },
                    })
                  ]}
                >
                  <Input.Password size='large' className='register__form__item__input register__form__item__input__pass' placeholder='Điền mật khẩu mới'/>
                </Form.Item>
                  
                <div style={{display:'flex', alignItems:'center',justifyContent:'center'}}>
                  <Form.Item style={{margin:'20px 5px 20px 5px'}} className='forgot__form__b'>
                    <Button className='forgot__form__b__button' onClick={handleBack} >Thử lại
                    </Button>
                  </Form.Item>
                  <Form.Item style={{margin:'20px 5px 20px 5px'}} className='forgot__form__b'>
                    <Button className='forgot__form__b__button'  htmlType="submit" >Thay đổi
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
              <h2 className='forgot__title'>QUÊN MẬT KHẨU</h2>
              <h5 className='forgot__slogan'>Tham gia cùng chúng tôi và bắt đầu hành trình của bạn!</h5>
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
                      message: 'Vui lòng điền tên đăng nhập hoặc email!',
                    }
                  ]}
                  style={{marginTop:'20px'}}
                >
                  <Input disabled={checkOTP} size='large' placeholder='Điền tên đăng nhập hoặc email' className='forgot__form__item__input forgot__form__item__input__mail' addonAfter={<UserOutlined />}/>
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
                        <p style={{color:'orangered', margin:'0px'}}>OTP đã được gửi. OTP sẽ hết hạn trong:  </p><Countdown onFinish={handleCountDown} value={deadline}/>
                      </div>
                    </>
                  }
                  { !checkOTP && 
                    <>
                      <h5 className='forgot__form__text'>Không có tài khoản. <span onClick={naviRegister} className='forgot__form__text__bold'>Đăng kí!</span></h5>
                      <h5 style={{margin:'5px 0px'}} className='forgot__form__text'>Đã nhớ mật khẩu. <span onClick={naviLogin} className='forgot__form__text__bold'> Đăng nhập!</span></h5>
                    </>
                  }
                  
                <div style={{display:'flex', alignItems:'center',justifyContent:'center'}}>
                  <Form.Item style={{margin:'20px 5px 20px 5px'}} className='forgot__form__b'>
                    <Button className='forgot__form__b__button' htmlType="submit">Gửi OTP
                    </Button>
                  </Form.Item>
                  <Form.Item style={{margin:'20px 5px 20px 5px'}} className='forgot__form__b'>
                    <Button className='forgot__form__b__button' onClick={handleNextToChange} >Gửi
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