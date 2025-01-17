import './style.scss';
import { Form, Input, Button, message,Checkbox } from 'antd';
import {MailOutlined, GoogleOutlined, FacebookOutlined, GithubOutlined, SmileOutlined,UserOutlined} from '@ant-design/icons'
import { useNavigate  } from 'react-router-dom';

function Login(){
  return (
    <>
    <div className="login">
      <div className='login__overlay'></div>
      <div className='login__form'>
        <h2 className='login__title'>LOGIN</h2>
        <h5 className='login__slogan'>Join Us Today and Start Your Journey to Success!</h5>
        <div className='login__icon'>
          <GoogleOutlined className='login__icon__i'/>
          <FacebookOutlined className='login__icon__i'/>
          <GithubOutlined className='login__icon__i'/>
        </div>
        <Form 
          initialValues={{
            remember: false, 
          }}
        >
          <Form.Item
            name="username"
            className='login__form__item'
            rules={[
              {
                required: true,
                message: 'Please input your username!',
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
                message: 'Please input your password!',
              }
            ]}
          >

            <Input.Password size='large' className='login__form__item__input login__form__item__input__pass' placeholder='Input password'/>
          </Form.Item>
          <h5 className='login__form__text'>Don't have an account. <span  className='login__form__text__bold'>Register here!</span></h5>
          <h5 style={{margin:'5px 0px'}} className='login__form__text'> <span  className='login__form__text__bold'> Forget Password?</span></h5>
          <Form.Item
              labelAlign='center'
              valuePropName="checked"
              name="remember"
              wrapperCol={{ offset: 8, span: 16 }}
              >
              <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item className='login__form__b'>
            <Button className='login__form__b__button' htmlType="submit">Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    </>
  )
}

export default Login;