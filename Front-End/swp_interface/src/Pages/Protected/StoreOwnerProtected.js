import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getToken, getRole } from "../../Utils/UserInfoUtils";

function StoreOwnerProtected(){
  const navigate = useNavigate();
  const role = getRole();
  const [ok, setOk] = useState(false);
  useEffect(()=>{
    if(!(role=='STORE_OWNER')){
      navigate('/unauthorized');
    }else{
      setOk(true);
    }
  },[])

  return (
    ok && <Outlet/>
  )
}

export default StoreOwnerProtected;