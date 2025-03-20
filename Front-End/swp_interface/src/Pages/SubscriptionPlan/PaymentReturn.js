import React, { useEffect, useState } from "react";
import { Button, Result, Spin } from "antd";
import axios from "axios";
import { getToken } from "../../Utils/UserInfoUtils";
import API from "../../Utils/API/API.js";

const PaymentResult = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("vnp_TxnRef");
    const transDate = params.get("vnp_PayDate");

    if (!orderId || !transDate) {
      setMessage("Thiếu thông tin đơn hàng hoặc thời gian giao dịch.");
      setLoading(false);
      return;
    }

    const apiUrl = API.VNPAY.PAYMENT_TRANSACTION(orderId, transDate);

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const responseData = res.data.data;
        if (responseData && responseData.includes("vnp_ResponseCode: 94")) {
          setMessage("Vui lòng kiểm tra lại sau ít phút.");
        } else {
          setMessage(responseData || "Có lỗi xảy ra.");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setMessage("Lỗi kết nối đến server.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Result
      status={loading ? "info" : "success"}
      title={loading ? <Spin size="large" /> : message}
      extra={
        !loading && [
          <Button
            type="primary"
            key="home"
            onClick={() => (window.location.href = "/")}
          >
            Quay lại trang chủ
          </Button>
        ]
      }
    />
  );
};

export default PaymentResult;
