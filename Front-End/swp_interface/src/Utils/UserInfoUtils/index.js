import { jwtDecode } from "jwt-decode";

export  function getToken() {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
}

export function getUsername() {
  return sessionStorage.getItem('username') || localStorage.getItem('username');
}

export function getRole() {
  return sessionStorage.getItem('role') || localStorage.getItem('role');
}

export const getRolebyToken = () =>{
  const token = getToken();
  if (!token) return null;
  const decodedToken = jwtDecode(token);
  return decodedToken.scope;
}