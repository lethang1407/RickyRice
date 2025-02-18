import HomeHeader from "../../Components/HomeHeader";
import StoreHomeBody from "../../Components/StoreHomeBody/StoreHomeBody";
import React, { useEffect, useState } from "react";
import API from '../../Utils/API/API.js'
const StoreHome = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(API.CUSTOMER.GET_ALL_PRODUCT) 
      .then(response => {
        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu từ API");
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setProducts(data);
      })
      .catch(error => console.error("Lỗi:", error));
  }, []);

  return (
    <>
      <HomeHeader />
      
      <StoreHomeBody products={products} /> 
      <div>
        
      </div>
    </>
  );
};

export default StoreHome;
