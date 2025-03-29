import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchDataWithoutToken } from "../../Utils/FetchUtils";
import axios from "axios";
import { message } from "antd";
import { successWSmile, error } from "../../Utils/AntdNotification";

export default function Authenticate() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const codeTokenRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(codeTokenRegex);

    if (isMatch) {
      const code = isMatch[1];
      const getToken =  async (code) =>{
        try{
          const res = await axios.post(`http://localhost:9999/auth/outbound/authenticate?code=${code}`);
          sessionStorage.setItem('token',res.data.data.token)
          successWSmile("Xin chào!", messageApi);
          setTimeout(() => {
            setIsLoggedin(true);
          },1000)
        }catch(err){
          error(err.response.data.message, messageApi);
          setTimeout(()=>{
            navigate("/login")
          },2000)
        }
      }
      getToken(code);
    }
  }, []);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/");
    }
  }, [isLoggedin, navigate]);

  return (
    <>
      {contextHolder}
    </>
  );
}