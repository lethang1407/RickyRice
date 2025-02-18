import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getToken, getRole } from "../../Utils/UserInfoUtils";

function StoreOwnerProtected(){
  const navigate = useNavigate();
  const role = getRole();
  useEffect(()=>{
    if(!(role=='STORE_OWNER')){
      navigate('/unauthorized');
    }
  },[])

  return (
    <Outlet/>
  )
}

export default StoreOwnerProtected;