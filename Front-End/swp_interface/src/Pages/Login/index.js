import './style.scss';
import { Form, Input, Button, message,Checkbox } from 'antd';
import { GoogleOutlined, FacebookOutlined, GithubOutlined,UserOutlined} from '@ant-design/icons'
import { useNavigate  } from 'react-router-dom';
import { checkLogin } from '../../Utils/FetchUtils';
import API from '../../Utils/API/API.js';
import { error, successWSmile} from '../../Utils/AntdNotification';
import { OAuthConfig } from '../../Configurations/configuration.js';
function Login(){
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (values) =>{
    const data = {
      username: values.username.trim().toLowerCase(),
      password: values.password
    }
    const login = await checkLogin(API.AUTH.LOGIN, data);
    if(login && login.code === 200 && login.data.success){
      if(values.remember){
        localStorage.setItem('token',login.data.token)
      }
      else{
        sessionStorage.setItem('token',login.data.token)
      }
      successWSmile('Xin chào!', messageApi);
      setTimeout(()=>{
        navigate('/');
      },1000)
    }else{
      error('Tên đăng nhập hoặc mật khẩu không đúng!', messageApi);
    }
  }

  const handleLoginGoogle = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    console.log(targetUrl);

    window.location.href = targetUrl;
  }

  const naviForgetPassword = () =>{
    navigate('/forgot-password');
  }

  const naviRegister = () =>{
    navigate('/register');
  }

  return (
    <>
    <div className="login">
      {contextHolder}
      <div className='login__overlay'></div>
      <div className='login__form'>
        <h2 className='login__title'>ĐĂNG NHẬP</h2>
        <h5 className='login__slogan'>Tham gia cùng chúng tôi và bắt đầu hành trình của bạn!</h5>
        <div className='login__icon'>
          <GoogleOutlined onClick={handleLoginGoogle} className='login__icon__i'/>
        </div>
        <Form 
          initialValues={{
            remember: false, 
          }}
          onFinish={handleLogin}
        >
          <Form.Item
            name="username"
            className='login__form__item'
            rules={[
              {
                required: true,
                message: 'Vui lòng điền tên đăng nhập!',
              }
            ]}
          >
            <Input size='large' placeholder='Input your Username' className='login__form__item__input login__form__item__input__mail' addonAfter={<UserOutlined />}/>
          </Form.Item>

          <Form.Item
            name="password"
            className='login__form__item'
            rules={[
              {
                required: true,
                message: 'Vui lòng điền mật khẩu!',
              }
            ]}
          >

            <Input.Password size='large' className='login__form__item__input login__form__item__input__pass' placeholder='Input password'/>
          </Form.Item>
          <h5 className='login__form__text'>Chưa có tài khoản. <span onClick={naviRegister} className='login__form__text__bold'>Đăng kí ngay!</span></h5>
          <h5 style={{margin:'5px 0px'}} className='login__form__text'> <span onClick={naviForgetPassword} className='login__form__text__bold'> Quên mật khẩu?</span></h5>
          <Form.Item
              labelAlign='center'
              valuePropName="checked"
              name="remember"
              wrapperCol={{ offset: 8, span: 16 }}
              >
              <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item className='login__form__b'>
            <Button className='login__form__b__button' htmlType="submit">Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    </>
  )
}

export default Login;