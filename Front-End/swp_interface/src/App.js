import "./App.css";
import { Routes, Route } from "react-router-dom";
import OwnerLayout from "./Components/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import StoreHome from './Pages/StoreHome';
import Register from "./Pages/Register";
import ForgetPassword from "./Pages/ForgetPassword";
import AdminDashboard from "./Pages/AdminDashboard";
import AccountOwner from "./Pages/AdminDashboard/AccountOwner";
import AdminViewStores from "./Pages/AdminDashboard/AdminViewStores";
import SubscriptionPlans from "./Pages/AdminDashboard/SubscriptionPlans";
import ProductsList from './Pages/ProductsLayout/ProductsLayout';
import ZoneList from './Pages/ZoneLayout/Zone';
import CreateProduct from './Pages/CreateProduct/CreateProduct';
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
        <Route path='/home/owner/products' element={<ProductsList />}> </Route>
        <Route path='/home/owner/ricezone' element={<ZoneList />}></Route>
        <Route path='/home/owner/products/CreateProduct' element={<CreateProduct />}></Route>
        <Route path='/storehome' element={<StoreHome/>}></Route>
    </Routes>
    </>
  );
}

export default App;
