import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getToken, getRole } from "../../Utils/UserInfoUtils";

function EmployeeProtected(){
  const navigate = useNavigate();
  const role = getRole();
  useEffect(()=>{
    if(!(role=='EMPLOYEE')){
      navigate('/unauthorized');
    }
  },[])

  return (
    <Outlet/>
  )
}

export default EmployeeProtected;