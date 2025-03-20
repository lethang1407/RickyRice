import React from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const StoreCard = ({
  urlStore,
  storeName,
  storeStatus,
  urlImg,
  onUpdateExpiration,
}) => {
  const navigate = useNavigate();

  return (
    <div className="wrapper">
      <div className="product-img">
        <img src={urlImg} alt="Product" height="100%" width="100%" />
      </div>
      <Link to={urlStore} className="product-link">
        <div className="product-info">
          <div className="product-text">
            <h1>{storeName}</h1>
            <h2>{storeStatus}</h2>
          </div>
        </div>
      </Link>
      <Button
        type="primary"
        style={{ marginTop: 8, width: "100%" }}
        onClick={(e) => {
          e.stopPropagation(); // Ngăn chặn sự kiện click vào Card
          onUpdateExpiration(); // Chuyển hướng đến /store-update
        }}
      >
        Cập nhật thời hạn
      </Button>
    </div>
  );
};

export default StoreCard;
