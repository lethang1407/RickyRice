import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SubscriptionPlanModal from "./components/SubscriptionPlanModal";
// import "./style.css";
import axios from "axios";
import API from "../../Utils/API/API.js";
import { getToken } from "../../Utils/UserInfoUtils";

const SubscriptionPlan = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    timeOfExpiration: "",
  });
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const token = getToken();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(API.ADMIN.VIEW_ALL_SUBSCRIPTION_PLAN, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlans(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        setPlans([]);
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.timeOfExpiration
    ) {
      alert("Tất cả các truờng là bắt buộc!");
      return;
    }
    try {
      const response = await axios.post(
        API.ADMIN.CREATE_SUBSCRIPTION_PLAN,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData({
        name: "",
        description: "",
        price: "",
        timeOfExpiration: "",
      });
      setPlans((prevPlans) => [...prevPlans, response.data.data]);
      setShowModal(false);
      setSuccessMessage("Gói đăng kí mới được tạo thành công!");
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (error) {
      console.error("Lỗi tạo mới gói đăng kí:", error);
      alert("Tạo mới gói đăng kí thất bại.");
    }
  };

  const handleEdit = (plan) => {
    setEditMode(true);
    setEditPlan(plan);
    setFormData({ ...plan });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    try {
      await axios.put(
        API.ADMIN.UPDATE_SUBSCRIPTION_PLAN(editPlan.subscriptionPlanID),
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlans((prevPlans) =>
        prevPlans.map((p) =>
          p.subscriptionPlanID === editPlan.subscriptionPlanID
            ? { ...p, ...formData }
            : p
        )
      );
      setShowModal(false);
      setEditMode(false);
      setEditPlan(null);
      setSuccessMessage("Cập nhật thành công!");
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (error) {
      console.error("Lỗi cập nhật gói đăng kí:", error);
      alert("Cập nhật thất bại.");
    }
  };

  return (
    <div>
      <div>
        <div className="container mt-5">
          <h2 className="mb-4 text-center">Dịch vụ đăng kí</h2>
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              setShowModal(true);
              setEditMode(false);
              setFormData({
                name: "",
                description: "",
                price: "",
                timeOfExpiration: "",
              });
            }}
          >
            Tạo mới gói đăng kí
          </button>
          <SubscriptionPlanModal
            show={showModal}
            onClose={() => setShowModal(false)}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={(e) => (editMode ? handleUpdate(e) : handleSubmit(e))}
            editMode={editMode}
          />
          <div className="mt-4">
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Tên</th>
                  <th>Mô tả</th>
                  <th>Giá (VNĐ)</th>
                  <th>Thời hạn (Tháng)</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {plans.length > 0 ? (
                  plans.map((plan, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{plan.name}</td>
                      <td>{plan.description}</td>
                      <td>{plan.price}</td>
                      <td>{plan.timeOfExpiration}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(plan)}
                        >
                          Chỉnh sửa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Không có gói đăng kí.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
