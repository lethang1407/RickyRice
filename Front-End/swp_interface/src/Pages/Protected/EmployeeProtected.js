import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getToken, getRole } from "../../Utils/UserInfoUtils";

function EmployeeProtected(){
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  const role = getRole();
  useEffect(()=>{
    if(!(role=='EMPLOYEE')){
      navigate('/unauthorized');
    }else{
      setOk(true);
    }
  },[])

  return (
    ok && <Outlet/>
  )
}

export default EmployeeProtected;