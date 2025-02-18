import { Form, Input, Button,Checkbox, message, DatePicker, Upload, Radio  } from 'antd';
import { GoogleOutlined, FacebookOutlined, GithubOutlined,UserOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import './style.scss';
import { useState } from 'react';
import { checkValid, fetchDataWithoutToken, handleUpload, register } from '../../Utils/FetchUtils';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { success, error} from '../../Utils/AntdNotification';
import API from '../../Utils/API/API.js';
function Register(){
  const [next, setNext] = useState(false);
  const [acc,setAcc] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const [file,setFile] = useState(null);

  const handleChangeFile = async (info) =>{
    if(info.fileList.length > 0){
      if(!info.fileList[0].originFileObj.type.startsWith('image/')){
        error('Only accept image file!', messageApi);
        return;
      }
      const fileSize = info.fileList[0].originFileObj.size / 1024 / 1024 < 10
      if(!fileSize){
        error('Image file size over 10MB!', messageApi);
        return;
      }
      setFile(info.fileList);
    }else{
      setFile(null);
    }
  }

  const naviLogin = ()=>{
    navigate('/login')
  }

  const handleRegister = async (values) =>{
    const data = {
      email: values.email,
      phone: values.phone,
    }
    const res = await checkValid(API.AUTH.CHECK_EMAIL_PHONE,data);
    if(!res.data.emailValid || !res.data.phoneValid){
      let str = '';
      if(!res.data.emailValid){
        str = 'Email'
      }
      if(!res.data.phoneValid){
        if(!res.data.emailValid){
          str += ', '
        }
        str += 'Phone Number'
      }
      str += ' is not Valid!';
      error(str, messageApi);
    }else{
      setLoading(true);
      if(file){
        const res = await handleUpload(API.PUBLIC.UPLOAD_IMG, file[0].originFileObj);
        if(res && res.code===200){
          const response = await register(API.AUTH.REGISTER,{...acc, avatar: res.data})
          if(response && response.code === 201){
            setTimeout(()=>{
              setLoading(false);
              success('Register Successful!',messageApi);
              setTimeout(()=>{
                naviLogin();
              },700)
            },2000)
          }else{
            setLoading(false);
            error('Register Failed!',messageApi);
          }
        }else{
          setLoading(false);
          error('Upload Failed!', messageApi);
        }
      }else{
        const response = await register(API.AUTH.REGISTER,acc)
        if(response && response.code === 201){
          setTimeout(()=>{
            setLoading(false);
            success('Register Successful!',messageApi);
            setTimeout(()=>{
              naviLogin();
            },700)
          },2000)
        }else{
          setLoading(false);
          error('Register Failed!',messageApi);
        }
      }
    }
  }

  const handleFormChange = (changedValues, allValues) =>{
    setAcc({
      ...acc,
      gender: allValues.gender,
      birthDate: allValues.date,
      name: allValues.name,
      email: allValues.email,
      phoneNumber: allValues.phone,
      role: allValues.role
    })
  }

  const handleNext = async (values) =>{
    const res = await fetchDataWithoutToken(API.AUTH.CHECK_USERNAME(values.username));
    console.log(acc);
    
    if(!res.data){
      setAcc({
        ...acc,
        username: values.username,
        password: values.password
      });
      setNext(true);
    }else{
      error('Username has existed!',messageApi);
    }
  }

  const handleBack = () =>{
    setNext(false);
  }

  return (
    <> 
      <div className="register">
        {loading && <Loading />}
        {contextHolder}
        {
          next ?
            <>
              <div style={{height:'70vh'}} className='register__overlay'></div>
              <div className='register__form'>
                <h2 className='register__title'>CONTINUE FORM</h2>
                <h5 style={{marginBottom:"30px"}} className='register__slogan'>Join Us Today and Start Your Journey to Success!</h5>
                
                <Form 
                  onFinish={handleRegister}
                  initialValues={{
                    remember: false, 
                  }}
                  onValuesChange={handleFormChange}
                >
                  <Form.Item
                    initialValue={acc.name ? acc.name : null}
                    name="name"
                    className='register__form__item'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Name!',
                      }
                    ]}
                  >
                    <Input size='large' placeholder='Input your Name' className='register__form__item__input register__form__item__input__mail' addonAfter={<UserOutlined />}/>
                  </Form.Item>


                  <Form.Item
                    initialValue={acc.email ? acc.email : null}
                    name="email"
                    className='register__form__item'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Email!',
                      },{ 
                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Email is not Valid!'
                      }
                    ]}
                  >
                    <Input size='large' className='register__form__item__input register__form__item__input__pass' placeholder='Input Email' addonAfter={<MailOutlined />} />
                  </Form.Item>

                  <Form.Item
                    initialValue={acc.phoneNumber ? acc.phoneNumber : null}
                    name="phone"
                    className='register__form__item'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Phone Number!',
                      },
                      { 
                        pattern: /^(0[3|5|7|8|9])(\d{8})$/,
                        message: 'Phone Number is not Valid!'
                      }
                    ]}
                  >
                    <Input size='large' className='register__form__item__input register__form__item__input__pass' addonAfter={<PhoneOutlined />} placeholder='Input Phone Number'/>
                  </Form.Item>

                  <Form.Item
                    initialValue={acc.role ? acc.role : null}
                    name="role"
                    className='register__form__item'
                    rules={[
                      {
                        required: true,
                        message: 'Please select your role!',
                      }
                    ]}
                  >
                    <Radio.Group className='register__form__item__checkbox' options={[
                        { label: 'Store Owner', value:'STORE_OWNER' },
                        { label: 'Employee', value: 'EMPLOYEE' }
                    ]} />
                  </Form.Item>


                  <Form.Item
                    initialValue={acc.gender ? acc.gender : ''}
                    name="gender"
                    className='register__form__item'
                  >
                    <Radio.Group className='register__form__item__checkbox' options={[
                        { label: 'Male', value:0 },
                        { label: 'Female', value: 1 },
                    ]} />
                  </Form.Item>

                  <Form.Item
                    name="date"
                    className='register__form__item'
                  >
                    <DatePicker defaultValue={acc.birthDate ? acc.birthDate : null} placeholder='Select birth Date' className='register__form__item__input register__form__item__input__pass'/>
                  </Form.Item>

                  <Form.Item
                    name="avatar"
                    className='register__form__item'
                  >
                    <Upload beforeUpload={() => false} fileList={file} onChange={handleChangeFile} maxCount={1} listType="picture">
                      <Button icon={<UploadOutlined />}>Click to Upload Your Avatar</Button>
                    </Upload>
                  </Form.Item>


                  <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <Form.Item style={{margin:'20px 5px'}} className='register__form__b'>
                      <Button className='register__form__b__button' onClick={handleBack} >Back
                      </Button>
                    </Form.Item>

                    <Form.Item style={{margin:'20px 5px'}} className='register__form__b'>
                      <Button className='register__form__b__button' htmlType="submit">Register
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </>
          : 
          <>
            <div className='register__overlay'></div>
            <div className='register__form'>
              <h2 className='register__title'>REGISTER</h2>
              <h5 className='register__slogan'>Join Us Today and Start Your Journey to Success!</h5>
              <div className='register__icon'>
                <GoogleOutlined className='register__icon__i'/>
                <FacebookOutlined className='register__icon__i'/>
                <GithubOutlined className='register__icon__i'/>
              </div>
              <Form 
                initialValues={{
                  remember: false, 
                }}
                onFinish={handleNext}
              >
                <Form.Item
                  initialValue={acc ? acc.username : ''}
                  name="username"
                  className='register__form__item'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your username!',
                    }
                  ]}
                >
                  <Input size='large' placeholder='Input your Username' className='register__form__item__input register__form__item__input__mail' addonAfter={<UserOutlined />}/>
                </Form.Item>

                <Form.Item
                  name="password"
                  initialValue={acc ? acc.password : ''}
                  className='register__form__item'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    }
                  ]}
                >

                  <Input.Password size='large' className='register__form__item__input register__form__item__input__pass' placeholder='Input password'/>
                </Form.Item>

                <Form.Item
                  name="passwordagain"
                  initialValue={acc ? acc.password : ''}
                  className='register__form__item'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password again!',
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
                  <Input.Password size='large' className='register__form__item__input register__form__item__input__pass' placeholder='Input password again'/>
                </Form.Item>

                <h5 style={{marginTop:'10px'}} className='register__form__text'>You've already had an account. <span onClick={naviLogin} className='register__form__text__bold'>Sign in here!</span></h5>

                <Form.Item style={{marginTop:'20px'}} className='register__form__b'>
                  <Button className='register__form__b__button' htmlType="submit">Next
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </>
        }
    </div>
    </>
  )
}

export default Register;