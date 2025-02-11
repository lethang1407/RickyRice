import "./App.css";
import { Routes, Route } from "react-router-dom";
import OwnerLayout from "./Components/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgetPassword from "./Pages/ForgetPassword";
import AdminDashboard from "./Pages/AdminDashboard";
import AccountOwner from "./Pages/AdminDashboard/AccountOwner";
import AdminViewStores from "./Pages/AdminDashboard/AdminViewStores";
import SubscriptionPlans from "./Pages/AdminDashboard/SubscriptionPlans";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" index element={<Home />}></Route>
        <Route path="/home/owner" element={<OwnerLayout />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgot-password" element={<ForgetPassword />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/admin" element={<AdminDashboard />}></Route>
        <Route path="/admin/account_owner" element={<AccountOwner />}></Route>
        <Route path="/admin/view_stores" element={<AdminViewStores />}></Route>
        <Route path="/admin/subscription_plans" element={<SubscriptionPlans />}></Route>
      </Routes>
    </>
  );
}

export default App;
