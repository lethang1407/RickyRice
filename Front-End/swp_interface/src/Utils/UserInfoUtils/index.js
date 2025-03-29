import { jwtDecode } from "jwt-decode";
import { introspect } from "../FetchUtils";
import API from '../API/API'

export  function getToken() {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
}

export const getRole = () =>{
  const token = getToken();
  if (!token) return null;
  const decodedToken = jwtDecode(token);
  return decodedToken.scope;
}

export const getUsername = () =>{
  const token = getToken();
  if (!token) return null;
  const decodedToken = jwtDecode(token);
  return decodedToken.sub;

}

export const logout = () => {
  const token = getToken();
  if(token){
    introspect(API.AUTH.LOGOUT,{token})
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
  }
}

export const formatNumberVN = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number) + ' đ';
}