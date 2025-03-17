import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getToken } from "../../Utils/UserInfoUtils";
import API from "../../Utils/API/API.js";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const vnp_TxnRef = searchParams.get("vnp_TxnRef");
  const vnp_PayDate = searchParams.get("vnp_PayDate");

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!vnp_TxnRef || !vnp_PayDate || !token) {
        setError("Thông tin giao dịch không hợp lệ.");
        setLoading(false);
        return;
      }

      const formData = new URLSearchParams();
      formData.append("order_id", vnp_TxnRef);
      formData.append("trans_date", vnp_PayDate);

      try {
        const res = await fetch(API.VNPAY.PAYMENT_TRANSACTION, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Lỗi hệ thống! Mã: ${res.status}`);
        }

        const data = await res.json();
        console.log("API Response:", data);

        if (!data.data) {
          throw new Error("Không nhận được dữ liệu giao dịch.");
        }

        const parsedData = data.data;

        if (parsedData.vnp_ResponseCode === "94") {
          setError("Vui lòng kiểm tra giao dịch của bạn sau ít phút nữa.");
        } else {
          setTransaction(parsedData);
        }
      } catch (err) {
        console.error("Fetch transaction error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [vnp_TxnRef, vnp_PayDate, token]);

  if (loading)
    return <p className="text-center mt-5">Đang kiểm tra giao dịch...</p>;

  if (error) {
    return (
      <div className="text-center mt-5">
        <p className="text-danger">{error}</p>
        <a href="/" className="btn btn-primary mt-3">
          Quay về trang chủ
        </a>
      </div>
    );
  }

  const isSuccess = transaction?.vnp_TransactionStatus === "00";

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className={`card shadow-lg text-center ${
          isSuccess ? "border-success" : "border-danger"
        }`}
        style={{ width: "400px" }}
      >
        <div
          className={`card-header ${
            isSuccess ? "bg-success text-white" : "bg-danger text-white"
          }`}
        >
          {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
        </div>
        <div className="card-body">
          <h5 className="card-title">
            {isSuccess ? "Giao dịch hoàn tất!" : "Giao dịch không thành công!"}
          </h5>
          <p className="card-text">
            Mã giao dịch: <strong>{transaction?.vnp_TxnRef}</strong>
          </p>
          <p className="card-text">
            Số tiền:{" "}
            <strong>
              {(Number(transaction?.vnp_Amount) / 100).toLocaleString("vi-VN")}{" "}
              VNĐ
            </strong>
          </p>
          <a href="/" className="btn btn-primary mt-3">
            Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
