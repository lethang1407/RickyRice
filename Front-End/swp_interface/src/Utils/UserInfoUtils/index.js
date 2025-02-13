import { jwtDecode } from "jwt-decode";
import { introspect } from "../FetchUtils";

export  function getToken() {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
}

export function getUsername() {
  return sessionStorage.getItem('username') || localStorage.getItem('username');
}

export const getRole = () =>{
  const token = getToken();
  if (!token) return null;
  const decodedToken = jwtDecode(token);
  return decodedToken.scope;
}

export const logout = () => {
  const token = getToken();
  introspect('http://localhost:9999/logout',{token})
  sessionStorage.removeItem('token');
  localStorage.removeItem('token');
}