import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { introspect } from "../../Utils/FetchUtils";
import { getToken } from "../../Utils/UserInfoUtils";
import { error } from "../../Utils/AntdNotification";
import { message } from "antd";

function CommonProtected(){
  const [messageApi, contextHolder] = message.useMessage();
  const token = getToken();
  const navigate = useNavigate();
  const [authenticated,setAuthenticated] = useState(null);
  useEffect(()=>{
    const getIntrospect = async () =>{
      const res = await introspect('http://localhost:9999/introspect',token)
      setAuthenticated(res.data.valid);
    }
    if(token){
      getIntrospect(token);
      if(authenticated && authenticated==false){
        error('Your session has been expired. Please login again!', messageApi);
        setTimeout(()=>{
          navigate('/login')
        },500)
      }
    }else{
      navigate('/login')
    }
  },[])

  return (
    <>
      {contextHolder}
      <Outlet/>
    </>
  )
}

export default CommonProtected;