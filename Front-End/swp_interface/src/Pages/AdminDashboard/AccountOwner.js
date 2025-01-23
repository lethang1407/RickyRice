import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Spinner} from "react-bootstrap";

const AccountOwner = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dữ liệu từ API
  useEffect(() => {
    axios
      .get("http://localhost:9999/admin/account_owner")
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  // Hàm cập nhật trạng thái tài khoản
  const updateAccountStatus = (accountID, isActive) => {
    axios
      .patch("http://localhost:9999/admin/account_active", {
        id: accountID,
        isActive,
      })
      .then((response) => {
        // Cập nhật trạng thái trong UI
        setUserData((prevUserData) =>
          prevUserData.map((user) =>
            user.accountID === accountID
              ? { ...user, isActive: isActive }
              : user
          )
        );
      })
      .catch((err) => {
        console.error("Error updating account status:", err);
        setError("Error updating account status");
      });
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      
      <h2>User Information</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Avatar</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Gender</th>
            <th>Birth Date</th>
            <th>Action</th> {/* Cột cho nút gạt */}
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr key={user.accountID}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="img-fluid"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <span>No Avatar</span>
                )}
              </td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>{user.isActive ? "Active" : "Inactive"}</td>
              <td>
                {user.gender === null
                  ? "Not Provided"
                  : user.gender
                  ? "Male"
                  : "Female"}
              </td>
              <td>
                {user.birthDate
                  ? new Date(user.birthDate).toLocaleDateString()
                  : "Not Provided"}
              </td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={user.isActive}
                    onChange={() =>
                      updateAccountStatus(user.accountID, !user.isActive)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AccountOwner;
