import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getToken, getRole } from "../../Utils/UserInfoUtils";

function AdminProtected(){
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  const role = getRole();
  useEffect(()=>{
    if(!(role=='ADMIN')){
      navigate('/unauthorized');
    }else{
      setOk(true);
    }
  },[])

  return (
    ok && <Outlet/>
  )
}

export default AdminProtected;