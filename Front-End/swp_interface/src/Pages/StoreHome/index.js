import HomeHeader from "../../Components/HomeHeader";
import StoreHomeBody from "../../Components/StoreHomeBody/StoreHomeBody";
import React, { useEffect, useState } from "react";

const StoreHome = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9999/store/products") 
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
      
      <StoreHomeBody products={products} /> {/* Truyền dữ liệu vào component */}

      {/* Hiển thị danh sách sản phẩm */}
      <div>
        
      </div>
    </>
  );
};

export default StoreHome;
