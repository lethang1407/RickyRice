import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { introspect } from "../../Utils/FetchUtils";
import { getToken } from "../../Utils/UserInfoUtils";
import { error } from "../../Utils/AntdNotification";
import { message } from "antd";
import API from "../../Utils/API/API";
import axios from "axios";

function ExpiredProtected(){
  const [messageApi, contextHolder] = message.useMessage();
  const token = getToken();
  const navigate = useNavigate();
  const [authenticated,setAuthenticated] = useState(null);
  const storeId = useParams().id;
  useEffect(()=>{
    const checkExpired = async () => {
      const response = await axios.get(`http://localhost:9999/store-owner/check-expired?storeId=${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAuthenticated(response.data.data)
      if(response && response.data.data==false){
        error('Hãy gia hạn đăng kí để tiếp tục sử dụng!', messageApi);
        setTimeout(()=>{
          navigate('/store-owner/store')
        },2000)
      }
    }
    checkExpired();
  },[])

  return (
    <>
      {contextHolder}
      {
        authenticated && <Outlet/>
      }
    </>
  )
}

export default ExpiredProtected;