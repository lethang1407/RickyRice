import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getToken, getRole } from "../../Utils/UserInfoUtils";

function AdminProtected(){
  const navigate = useNavigate();
  const role = getRole();
  useEffect(()=>{
    if(!(role=='ROLE_ADMIN')){
      navigate('/unauthorized');
    }
  },[])

  return (
    <Outlet/>
  )
}

export default AdminProtected;