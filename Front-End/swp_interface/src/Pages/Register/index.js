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
        error('Trường chỉ chấp nhận file ảnh!', messageApi);
        return;
      }
      const fileSize = info.fileList[0].originFileObj.size / 1024 / 1024 < 10
      if(!fileSize){
        error('File ảnh không được quá 10MB!', messageApi);
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
      email: values.email.trim().toLowerCase(),
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
        str += 'Số điện thoại'
      }
      str += ' không khả dụng!';
      error(str, messageApi);
    }else{
      setLoading(true);
      if(file){
        const res = await handleUpload(API.PUBLIC.UPLOAD_IMG, file[0].originFileObj);
        if(res && res.code===200){
          const response = await register(API.AUTH.REGISTER,{...acc, avatar: res.data, role: 'STORE_OWNER'})
          if(response && response.code === 201){
            setTimeout(()=>{
              setLoading(false);
              success('Đăng kí thành công!',messageApi);
              setTimeout(()=>{
                naviLogin();
              },700)
            },2000)
          }else{
            setLoading(false);
            error('Đăng kí thất bại!',messageApi);
          }
        }else{
          setLoading(false);
          error('Upload không thành công!', messageApi);
        }
      }else{
        const response = await register(API.AUTH.REGISTER, {...acc, role: 'STORE_OWNER'})
        if(response && response.code === 201){
          setTimeout(()=>{
            setLoading(false);
            success('Đăng kí thành công!',messageApi);
            setTimeout(()=>{
              naviLogin();
            },700)
          },2000)
        }else{
          setLoading(false);
          error('Đăng kí thất bại!',messageApi);
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
      email: allValues.email ? allValues.email.trim().toLowerCase() : null,
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
        username: values.username.trim().toLowerCase(),
        password: values.password
      });
      setNext(true);
    }else{
      error('Tên đăng nhập đã tổn tại!',messageApi);
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
                <h2 className='register__title'>ĐIỀN FORM</h2>
                <h5 style={{marginBottom:"30px"}} className='register__slogan'>Tham gia cùng chúng tôi và bắt đầu hành trình của bạn!</h5>
                
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
                        message: 'Vui lòng điền tên!',
                        
                      },
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
                    <Input size='large' placeholder='Tên của bạn' className='register__form__item__input register__form__item__input__mail' addonAfter={<UserOutlined />}/>
                  </Form.Item>


                  <Form.Item
                    initialValue={acc.email ? acc.email : null}
                    name="email"
                    className='register__form__item'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng điền email!',
                      },{ 
                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Email không đúng định dạng!'
                      }
                    ]}
                  >
                    <Input size='large' className='register__form__item__input register__form__item__input__pass' placeholder='Email' addonAfter={<MailOutlined />} />
                  </Form.Item>

                  <Form.Item
                    initialValue={acc.phoneNumber ? acc.phoneNumber : null}
                    name="phone"
                    className='register__form__item'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng điền số điện thoại!',
                      },
                      { 
                        pattern: /^(0[3|5|7|8|9])(\d{8})$/,
                        message: 'Số điện thoại không đúng định dạng!'
                      }
                    ]}
                  >
                    <Input size='large' className='register__form__item__input register__form__item__input__pass' addonAfter={<PhoneOutlined />} placeholder='Số điện thoại'/>
                  </Form.Item>

                  <Form.Item
                    hidden={true} 
                    name="role"
                    className='register__form__item'
                    rules={[
                      {
                        message: 'Please select your role!',
                      }
                    ]}
                  >
                    <Radio.Group className='register__form__item__checkbox' options={[
                        { label: 'Store Owner', value:'STORE_OWNER' },
                    ]} />
                  </Form.Item>


                  <Form.Item
                    initialValue={acc.gender ? acc.gender : ''}
                    name="gender"
                    className='register__form__item'
                  >
                    <Radio.Group className='register__form__item__checkbox' options={[
                        { label: 'Nam', value:0 },
                        { label: 'Nữ', value: 1 },
                    ]} />
                  </Form.Item>

                  <Form.Item
                    name="date"
                    className='register__form__item'
                  >
                    <DatePicker defaultValue={acc.birthDate ? acc.birthDate : null} placeholder='Ngày sinh' className='register__form__item__input register__form__item__input__pass'/>
                  </Form.Item>

                  <Form.Item
                    name="avatar"
                    className='register__form__item'
                  >
                    <Upload beforeUpload={() => false} fileList={file} onChange={handleChangeFile} maxCount={1} listType="picture">
                      <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button>
                    </Upload>
                  </Form.Item>


                  <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <Form.Item style={{margin:'20px 5px'}} className='register__form__b'>
                      <Button className='register__form__b__button' onClick={handleBack} >Quay lại
                      </Button>
                    </Form.Item>

                    <Form.Item style={{margin:'20px 5px'}} className='register__form__b'>
                      <Button className='register__form__b__button' htmlType="submit">Đăng kí
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
              <h2 className='register__title'>ĐĂNG KÍ</h2>
              <h5 className='register__slogan'>Tham gia cùng chúng tôi và bắt đầu hành trình của bạn!</h5>
              <div className='register__icon'>
                
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
                      message: 'Vui lòng điền tên đăng nhập!',
                    },
                    {
                      pattern: /^(?=.*[a-zA-Z])[a-zA-Z0-9]{3,20}$/,
                      message: 'Tên đăng nhập phải có ít nhất 1 chữ cái, chỉ chứa chữ và số, từ 3 đến 20 ký tự!',
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
                      message: 'Vui lòng điền mật khẩu!',
                    },
                    {
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm ít nhất 1 chữ cái, 1 số và 1 ký tự đặc biệt!',
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
                      message: 'Vui lòng điền vào kiểm tra mật khẩu!',
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
                  <Input.Password size='large' className='register__form__item__input register__form__item__input__pass' placeholder='Input password again'/>
                </Form.Item>

                <h5 style={{marginTop:'10px'}} className='register__form__text'>Đã có tài khoản. <span onClick={naviLogin} className='register__form__text__bold'>Đăng nhập tại đây!</span></h5>

                <Form.Item style={{marginTop:'20px'}} className='register__form__b'>
                  <Button className='register__form__b__button' htmlType="submit">Tiếp tục
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