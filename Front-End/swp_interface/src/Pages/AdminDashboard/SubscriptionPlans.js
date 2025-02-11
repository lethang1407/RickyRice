import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import "./style.css";
import axios from "axios";

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

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9999/admin/subscription_plans"
        );
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
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.timeOfExpiration
    ) {
      alert("All fields are required!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:9999/admin/create_subscription_plans",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
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
      setSuccessMessage("Subscription Plan created successfully!");
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (error) {
      console.error("Error creating subscription plan:", error);
      alert("Failed to create subscription plan.");
    }
  };

  const handleEdit = (plan) => {
    setEditMode(true);
    setEditPlan(plan);
    setFormData({ ...plan });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:9999/admin/update_subscription_plans/${editPlan.subscriptionPlanID}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
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
      setSuccessMessage("Subscription Plan updated successfully!");
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (error) {
      console.error("Error updating subscription plan:", error);
      alert("Failed to update subscription plan.");
    }
  };

  return (
    <div>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <div className="container mt-5">
          <h2 className="mb-4 text-center">Subscription Plans</h2>
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
            Create New Plan
          </button>
          {showModal && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editMode
                        ? "Edit Subscription Plan"
                        : "Create Subscription Plan"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={editMode ? handleUpdate : handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Price ($)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Time of Expiration (month)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="timeOfExpiration"
                          value={formData.timeOfExpiration}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-success">
                        {editMode ? "Update" : "Create"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4">
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price ($)</th>
                  <th>Time of Expiration (month)</th>
                  <th>Actions</th>
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
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No subscription plans available.
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
