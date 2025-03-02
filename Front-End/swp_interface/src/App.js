import "./App.css";
import { Routes, Route } from "react-router-dom";
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
import Store from "./Pages/ShopOwner/Store/Store";
import StoreOwnerLayout from "./Components/StoreOwner/Layout";
import Invoice from "./Pages/ShopOwner/Invoice/Invoice";
import Product from "./Pages/ShopOwner/Product/Product";
import CommonProtected from "./Pages/Protected/CommonProtected";
import Unauthorized from "./Pages/ErrorPage/Unauthorized";
import AdminProtected from "./Pages/Protected/AdminProtected";
import EmployeeProtected from "./Pages/Protected/EmployeeProtected";
import StoreOwnerProtected from "./Pages/Protected/StoreOwnerProtected";
import Employee_CustomerLayout from "./Pages/Employee_CustomerLayout";
import Employee_Customer from "./Pages/Employee_CustomerLayout";
import CustomerIN4Edit from "./Pages/Employee_CustomerLayout/components/customeEdit";
import CustomerIN4Create from "./Pages/Employee_CustomerLayout/components/customerCreate";
import Employee from "./Pages/ShopOwner/Employee/Employee";
import Statistic from "./Pages/ShopOwner/Statistic/Statistic";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" index element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgot-password" element={<ForgetPassword />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/unauthorized" element={<Unauthorized/>}></Route>
        <Route path='/storehome' element={<StoreHome/>}></Route>
        <Route element={<CommonProtected/>}>
          <Route element={<AdminProtected/>}>
            <Route path="/admin" element={<AdminDashboard />}></Route>
            <Route path="/admin/account_owner" element={<AccountOwner />}></Route>
            <Route path="/admin/view_stores" element={<AdminViewStores />}></Route>
            <Route path="/admin/subscription_plans" element={<SubscriptionPlans />}></Route>
          </Route>
          <Route element={<EmployeeProtected />}>
            <Route path='/employee/products' element={<ProductsList />}> </Route>
            <Route path='/employee/ricezone' element={<ZoneList />}></Route>
            <Route path='/employee/products/createproduct' element={<CreateProduct />}></Route>
            <Route path='/employee/customers/edit' element={<CustomerIN4Edit />}></Route>
            <Route path='/employee/customers' element={<Employee_Customer />}></Route>
            <Route path='/employee/customers/create' element={<CustomerIN4Create />}></Route>
          </Route>
          <Route element={<StoreOwnerProtected/>}>
            <Route path="/store-owner" element={<StoreOwnerLayout />}>
              <Route path="store" element={<Store />}></Route>
              <Route path="invoice" element={<Invoice />}></Route>
              <Route path="product" element={<Product />}></Route>
              <Route path="employee" element={<Employee />}></Route>
              <Route path="statistic" element={<Statistic />}></Route>
            </Route>
          </Route>
        </Route>
    </Routes>
    </>
  );
}

export default App;
