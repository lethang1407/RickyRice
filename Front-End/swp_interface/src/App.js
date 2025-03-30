import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import StoreHome from "./Pages/StoreHome";
import Register from "./Pages/Register";
import ForgetPassword from "./Pages/ForgetPassword";
import AdminLayout from "./Pages/AdminDashboard/index.js";
import AdminDashboard from "./Pages/AdminDashboard/DashboardContent";
import AccountOwner from "./Pages/AdminDashboard/AccountOwner";
import AdminViewStores from "./Pages/AdminDashboard/AdminViewStores";
import SubscriptionPlans from "./Pages/AdminDashboard/SubscriptionPlans";
import ZoneList from "./Pages/ZoneLayout/Zone";
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
import StatisticData from "./Pages/ShopOwner/StatisticData/StatisticData.js";
import Debt from "./Pages/Debt";
import Employee_Invoices from "./Pages/Employee_InvoiceLayout";
import ProductUpdate from "./Pages/ShopOwner/ProductUpdate/ProductUpdate";
import EmployeeUpdate from "./Pages/ShopOwner/EmployeeUpdate/EmployeeUpdate";
import SubscriptionPlan from "./Pages/SubscriptionPlan/SubscriptionPlans";
import PaymentReturn from "./Pages/SubscriptionPlan/PaymentReturn";
import AccountInfo from "./Pages/Account/AccountInfo";
import ChangePassword from "./Pages/Account/ChangePasswordAcc";
import StoreLayout from "./Components/StoreLayout/storelayout.js";
import Zone from "./Pages/StoreManagement/Zone/Zone.js";
import StoreDetailCategory from "./Pages/StoreManagement/Category/Category.js";
import StoreDetailProductAttribute from "./Pages/StoreManagement/ProductAttribute/ProductAttribute.js";
import StoreProduct from "./Pages/StoreManagement/Product/Product.js";
import { WebSocketProvider } from "./Utils/Websocket/WebsocketContextProvider.js";
import CustomerDebt from "./Pages/Debt/CustomerDebt/customer.js";
import Authenticate from "./Pages/Login/authenticate.js";
import CreateStore from "./Pages/StoreManagement/StoreInfor/CreateStore.js";
import UpdateStore from "./Pages/StoreManagement/StoreInfor/UpdateStore.js";
import StatisticChart from "./Pages/ShopOwner/StatisticChart/StatisticChart.js";
import DebtEmploy from "./Pages/Employee_DebtLayout/index.js";
import Package from "./Pages/Package/index.js";
import Transactions from "./Pages/ShopOwner/TransactionOwner/Transaction.js";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" index element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgot-password" element={<ForgetPassword />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/authenticate" element={<Authenticate />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />}></Route>
        <Route path="/storehome/:storeID" element={<StoreHome />}></Route>
        <Route path="/service/:storeID?" element={<SubscriptionPlan />} />
        <Route element={<CommonProtected />}>
          <Route element={<AdminProtected />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="statistic" element={<AdminDashboard />}></Route>
              <Route path="account_owner" element={<AccountOwner />}></Route>
              <Route path="view_stores" element={<AdminViewStores />}></Route>
              <Route path="subscription_plans" element={<SubscriptionPlans />}></Route>
            </Route>
          </Route>
          <Route element={<EmployeeProtected />}>
            <Route
              path="/employee/products"
              element={<Employee_Products />}
            ></Route>
            <Route path="/employee/ricezone" element={<ZoneList />}></Route>
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
            <Route
              path="/employee/invoices"
              element={
                <WebSocketProvider>
                  <Employee_Invoices />
                </WebSocketProvider>
              }
            ></Route>
            {/* <Route path="/employee/products" element={<ProductsList />}></Route> */}
            {/* <Route path="/employee/products/createproduct" element={<CreateProduct />} ></Route> */}
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
            <Route path="/employee/debt" element={<Debt />}></Route>
            <Route path="/employee/customer-debt" element={<DebtEmploy />}></Route>
          </Route>
          <Route element={<StoreOwnerProtected />}>
            <Route path="/store-owner" element={<StoreOwnerLayout />}>
              <Route path="store" element={<Store />}></Route>
              <Route path="invoice" element={<Invoice />}></Route>
              <Route path="product" element={<Product />}></Route>
              <Route path="employee" element={<Employee />}></Route>
              <Route path="statistic/data" element={<StatisticData />}></Route>
              <Route path="statistic/chart" element={<StatisticChart />}></Route>
              <Route path="debt" element={<Debt />}></Route>
              <Route path="product/update" element={<ProductUpdate />} />
              <Route path="employee/update" element={<EmployeeUpdate />} />
              <Route path="debt" element={<Debt />}></Route>
              <Route path="customer-debt" element={<WebSocketProvider><CustomerDebt /></WebSocketProvider>}></Route>
              <Route
                path="create-store/:transactionNo"
                element={<CreateStore />}
              ></Route>
              <Route path="transaction-history" element={<Transactions />}></Route>
            </Route>
            <Route path="/vnpay/payment-return" element={<PaymentReturn />} />
          </Route>
          <Route element={<StoreOwnerProtected />}>
            <Route path="/store/:id" element={<StoreLayout />}>
              <Route path="zone" element={<Zone />}></Route>
              <Route path="package" element={<Package />}></Route>
              <Route path="product" element={<StoreProduct />}></Route>
              <Route path="update-info" element={<UpdateStore />}></Route>
              <Route path="category" element={<StoreDetailCategory />}></Route>
              <Route path="productattribute" element={<StoreDetailProductAttribute />}></Route>
            </Route>
          </Route>
          <Route path="/account-info" element={<AccountInfo />} />
          <Route path="/account-change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
