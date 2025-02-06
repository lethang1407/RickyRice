import axios from 'axios';

export const fetchDataWithoutToken = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
};

export const checkLogin = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
};

export const checkValid = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
};

export const register = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
};

export const getDataWithToken = async (url, token) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
};

export const handleUpload = async (url,file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

