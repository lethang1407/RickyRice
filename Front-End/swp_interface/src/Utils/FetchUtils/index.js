import axios from 'axios';

export const fetchDataWithoutToken = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    throw error; 
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
    throw error; 
  }
};

