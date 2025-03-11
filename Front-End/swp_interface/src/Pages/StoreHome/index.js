import HomeHeader from "../../Components/HomeHeader";
import StoreHomeBody from "../../Components/StoreHomeBody/StoreHomeBody";
import React, { useEffect, useState } from "react";
import API from '../../Utils/API/API.js'
import Footer from "../../Components/Footer/index.js";
const StoreHome = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(API.CUSTOMER.GET_ALL_PRODUCT) 
      .then(response => {
        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu từ API");
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
      })
      .catch(error => console.error("Lỗi:", error));
  }, []);

  useEffect(() => {
    fetch(API.CUSTOMER.GET_ALL_CATEGORY)
    .then(response => {
      if (!response.ok) {
        throw new Error("Lỗi khi lấy dữ liệu từ API");
      }
      return response.json();
      })
      .then(data => {
          setCategories(data);
      })
      .catch(error => console.error("Lỗi:", error));
  }, []);

  return (
    <>
      <HomeHeader />
      <StoreHomeBody products={products} categories={categories}/> 
      
      <Footer />
    </>
  );
};

export default StoreHome;