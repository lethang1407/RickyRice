import React from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { Button } from "antd";
import moment from 'moment'; 

const StoreCard = ({
  urlStore,
  storeName,
  expireAt,
  urlImg,
  onUpdateExpiration,
}) => {

  const getStatusAndFormat = (expireAt) => {
    if (!expireAt) {
      return { statusText: "Hết hạn", className: "status-expired" };
    }
    const now = moment();
    const expiration = moment(expireAt); 
    if (expiration.isBefore(now)) {
      return { statusText: "Hết hạn", className: "status-expired" };
    } else {
        return { statusText: `Hoạt động đến ${expiration.format('DD/MM/YYYY HH:mm')}`, className: "status-active" };
    }
  };

  const { statusText, className } = getStatusAndFormat(expireAt);


  return (
    <div className="wrapper">
      <div className="product-img">
        <img src={urlImg} alt="Product" height="100%" width="100%" />
      </div>
      <Link to={urlStore} className="product-link">
        <div className={`product-info ${className}`}>
          <div className="product-text">
            <h1>{storeName}</h1>
            <h2>{statusText}</h2>
          </div>
        </div>
      </Link>
      <Button
        type="primary"
        onClick={(e) => {
          e.stopPropagation();
          onUpdateExpiration();
        }}
      >
        Cập nhật thời hạn
      </Button>
    </div>
  );
};

export default StoreCard;