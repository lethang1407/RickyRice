import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import StoreHome from "./Pages/StoreHome";
import Register from "./Pages/Register";
import ForgetPassword from "./Pages/ForgetPassword";
import AdminDashboard from "./Pages/AdminDashboard";
import AccountOwner from "./Pages/AdminDashboard/AccountOwner";
import AdminViewStores from "./Pages/AdminDashboard/AdminViewStores";
import SubscriptionPlans from "./Pages/AdminDashboard/SubscriptionPlans";
<<<<<<< HEAD
import ZoneList from './Pages/ZoneLayout/Zone';
=======
import ProductsList from "./Pages/ProductsLayout/ProductsLayout";
import ZoneList from "./Pages/ZoneLayout/Zone";
import CreateProduct from "./Pages/CreateProduct/CreateProduct";
>>>>>>> cbcaaac81f0c7ca6b48ec00d94894f310c8158f2
import Store from "./Pages/ShopOwner/Store/Store";
import StoreOwnerLayout from "./Components/StoreOwner/Layout";
import Invoice from "./Pages/ShopOwner/Invoice/Invoice";
import Product from "./Pages/ShopOwner/Product/Product";
import CommonProtected from "./Pages/Protected/CommonProtected";
import Unauthorized from "./Pages/ErrorPage/Unauthorized";
import AdminProtected from "./Pages/Protected/AdminProtected";
import EmployeeProtected from "./Pages/Protected/EmployeeProtected";
import StoreOwnerProtected from "./Pages/Protected/StoreOwnerProtected";
import Employee_Customer from "./Pages/Employee_CustomerLayout";
import CustomerIN4Edit from "./Pages/Employee_CustomerLayout/components/customeEdit";
import CustomerIN4Create from "./Pages/Employee_CustomerLayout/components/customerCreate";
import Employee from "./Pages/ShopOwner/Employee/Employee";
import Employee_Products from "./Pages/Employee_ProductLayout/components/productsList";
import Statistic from "./Pages/ShopOwner/Statistic/Statistic";
import Debt from "./Pages/Debt";
<<<<<<< HEAD
import Employee_Invoices from "./Pages/Employee_InvoiceLayout";
=======
import ProductUpdate from "./Pages/ShopOwner/ProductUpdate/ProductUpdate";
import EmployeeUpdate from "./Pages/ShopOwner/EmployeeUpdate/EmployeeUpdate";
import SubscriptionPlan from "./Pages/SubscriptionPlan/SubscriptionPlans";
import PaymentReturn from "./Pages/SubscriptionPlan/PaymentReturn";
import AccountInfo from "./Pages/Account/AccountInfo";
import ChangePassword from "./Pages/Account/ChangePasswordAcc";
>>>>>>> cbcaaac81f0c7ca6b48ec00d94894f310c8158f2

function App() {
  return (
    <>
      <Routes>
        <Route path="/" index element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgot-password" element={<ForgetPassword />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />}></Route>
<<<<<<< HEAD
        <Route path='/storehome' element={<StoreHome />}></Route>
=======
        <Route path="/storehome" element={<StoreHome />}></Route>
        <Route path="/subscriptionPlan" element={<SubscriptionPlan />}></Route>

>>>>>>> cbcaaac81f0c7ca6b48ec00d94894f310c8158f2
        <Route element={<CommonProtected />}>
          <Route element={<AdminProtected />}>
            <Route path="/admin" element={<AdminDashboard />}></Route>
            <Route
              path="/admin/account_owner"
              element={<AccountOwner />}
            ></Route>
            <Route
              path="/admin/view_stores"
              element={<AdminViewStores />}
            ></Route>
            <Route
              path="/admin/subscription_plans"
              element={<SubscriptionPlans />}
            ></Route>
          </Route>
          <Route element={<EmployeeProtected />}>
<<<<<<< HEAD
            <Route path='/employee/products' element={<Employee_Products />}> </Route>
            <Route path='/employee/ricezone' element={<ZoneList />}></Route>
            <Route path='/employee/customers/edit' element={<CustomerIN4Edit />}></Route>
            <Route path='/employee/customers' element={<Employee_Customer />}></Route>
            <Route path='/employee/customers/create' element={<CustomerIN4Create />}></Route>
            <Route path='/employee/invoices' element={<Employee_Invoices />}></Route>
=======
            <Route path="/employee/products" element={<ProductsList />}>
              {" "}
            </Route>
            <Route path="/employee/ricezone" element={<ZoneList />}></Route>
            <Route
              path="/employee/products/createproduct"
              element={<CreateProduct />}
            ></Route>
            <Route
              path="/employee/customers/edit"
              element={<CustomerIN4Edit />}
            ></Route>
            <Route
              path="/employee/customers"
              element={<Employee_Customer />}
            ></Route>
            <Route
              path="/employee/customers/create"
              element={<CustomerIN4Create />}
            ></Route>
>>>>>>> cbcaaac81f0c7ca6b48ec00d94894f310c8158f2
          </Route>
          <Route element={<StoreOwnerProtected />}>
            <Route path="/store-owner" element={<StoreOwnerLayout />}>
              <Route path="store" element={<Store />}></Route>
              <Route path="invoice" element={<Invoice />}></Route>
              <Route path="product" element={<Product />}></Route>
              <Route path="employee" element={<Employee />}></Route>
              <Route path="statistic" element={<Statistic />}></Route>
<<<<<<< HEAD
=======
              <Route path="debt" element={<Debt/>}></Route>
              <Route path="product/update" element={<ProductUpdate />} />
              <Route path="employee/update" element={<EmployeeUpdate />} />
>>>>>>> cbcaaac81f0c7ca6b48ec00d94894f310c8158f2
              <Route path="debt" element={<Debt />}></Route>
            </Route>
            <Route path="/vnpay/payment-return" element={<PaymentReturn />} />
          </Route>
          <Route path="/account-info" element={<AccountInfo />} />
          <Route path="/account-change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
