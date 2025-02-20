import React, { useState } from "react";

const SubscriptionPlanModal = ({
  show,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  editMode,
}) => {
  const [errors, setErrors] = useState({});

  if (!show) return null;

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống.";
    if (!formData.description.trim())
      newErrors.description = "Mô tả không được để trống.";
    if (formData.price <= 0) newErrors.price = "Giá tiền phải lớn hơn 0.";
    if (formData.timeOfExpiration <= 0)
      newErrors.timeOfExpiration = "Thời hạn phải lớn hơn 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit();
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editMode ? "Chỉnh sửa gói đăng kí" : "Tạo mới gói đăng kí"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label className="form-label">Tên</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <textarea
                  className={`form-control ${
                    errors.description ? "is-invalid" : ""
                  }`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Giá tiền ($)</label>
                <input
                  type="number"
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                />
                {errors.price && (
                  <div className="invalid-feedback">{errors.price}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Thời hạn (tháng)</label>
                <input
                  type="number"
                  className={`form-control ${
                    errors.timeOfExpiration ? "is-invalid" : ""
                  }`}
                  name="timeOfExpiration"
                  value={formData.timeOfExpiration}
                  onChange={handleChange}
                  required
                  min="1"
                />
                {errors.timeOfExpiration && (
                  <div className="invalid-feedback">
                    {errors.timeOfExpiration}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button type="submit" className="btn btn-success">
                  {editMode ? "Cập nhật" : "Tạo mới"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={onClose}
                >
                  Thoát
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanModal;
