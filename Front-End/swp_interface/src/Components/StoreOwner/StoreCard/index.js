import React from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { Button, message } from "antd";
import moment from 'moment';
import { error } from '../../../Utils/AntdNotification'; 

const StoreCard = ({
  urlStore,
  storeName,
  expireAt,
  urlImg,
  onUpdateExpiration,
}) => {

  const [messageApi, contextHolder] = message.useMessage(); 

  const getStatusAndFormat = (expireAt) => {
    if (!expireAt) {
      return { statusText: "Hết hạn", className: "status-expired", isActive: false };
    }
    const now = moment();
    const expiration = moment(expireAt);
    if (expiration.isBefore(now)) {
      return { statusText: "Hết hạn", className: "status-expired", isActive: false };
    } else {
        return { statusText: `Hoạt động đến ${expiration.format('DD/MM/YYYY')}`, className: "status-active", isActive: true };
    }
  };

  const { statusText, className, isActive } = getStatusAndFormat(expireAt);

  const handleLinkClick = (e) => {
    if (!isActive) {
      e.preventDefault(); 
      e.stopPropagation(); 

      error("Bạn cần gia hạn để truy cập !", messageApi);
    }
  };


  return (
    <div className="wrapper">
       {contextHolder}
      <div className="product-img">
        <img src={urlImg} alt="Product" height="100%" width="100%" />
      </div>
      <Link
        to={urlStore}
        className="product-link"
        onClick={handleLinkClick} 
      >
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