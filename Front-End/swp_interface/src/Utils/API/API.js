const API_BASE_URL = "http://localhost:9999";

const API = {
  ADMIN: {
    GET_ALL_ACCOUNT: `${API_BASE_URL}/admin/account-owner`,
    GET_ACCOUNT_BY_ID: (id) => `${API_BASE_URL}/admin/account/${id}`,
    UPDATE_ACCOUNT_STATUS: `${API_BASE_URL}/admin/account-active`,
    VIEW_REVENUE: `${API_BASE_URL}/admin/view-revenue`,
    VIEW_ALL_STORE: `${API_BASE_URL}/admin/view-store`,
    VIEW_ALL_SUBSCRIPTION_PLAN: `${API_BASE_URL}/admin/subscription-plans`,
    VIEW_SUBSCRIPTION_PLAN_BY_ID: (id) =>
      `${API_BASE_URL}/admin/subscription-plan/${id}`,
    CREATE_SUBSCRIPTION_PLAN: `${API_BASE_URL}/admin/create-subscription-plan`,
    UPDATE_SUBSCRIPTION_PLAN: (id) =>
      `${API_BASE_URL}/admin/update-subscription-plan/${id}`,
  },
  CUSTOMER: {
    GET_ALL_PRODUCT: `${API_BASE_URL}/store/products`
  },
  ACCOUNT: {
    GET_ALL_NOTIFICATIONS: `${API_BASE_URL}/account/notifications`,
    MARK_NOTI_AS_READ: `${API_BASE_URL}/account/notifications/mark-as-read`,
    GET_INFOR_ACCOUNT: `${API_BASE_URL}/account/infor`,
    UPDATE_ACCOUNT: `${API_BASE_URL}/account/update`,
    CHANGE_PASSWORD: `${API_BASE_URL}/account/change-password`,
  },
  CUSTOMER: {
    GET_ALL_PRODUCT: `${API_BASE_URL}/store/products`,
    GET_ALL_CATEGORY: `${API_BASE_URL}/store/categories`
  },
  EMPLOYEE: {
    GET_ALL_CUSTOMER: `${API_BASE_URL}/employee/customers`,
    GET_ALL_CUSTOMERlist: `${API_BASE_URL}/employee/customersList`,
    UPDATE_USER: (id) => `${API_BASE_URL}/employee/customers/edit/${id}`,
    INVOICE_UPDATE_USER: (phoneNumber) => `${API_BASE_URL}/employee/customers/editInvoice/${phoneNumber}`,
    CREATE_CUSTOMER: `${API_BASE_URL}/employee/customers/create`,
    // GET_CATEGORY_PAGINATION: `${API_BASE_URL}/employee/categories/pagination`,
    // GET_ALL_CATEGORY: `${API_BASE_URL}/employee/categories`,
    // GET_CATEGORY_BY_NAME: `${API_BASE_URL}/employee/category`,
    // GET_PRODUCTS_BY_CATEGORY: `${API_BASE_URL}/employee/products-by-category`,
    GET_PRODUCTS_BY_NAMElist: `${API_BASE_URL}/employee/productsList`,
    GET_PRODUCTS_BY_NAME: `${API_BASE_URL}/employee/products`,
    GET_RICEZONE: `${API_BASE_URL}/employee/ricezone`,
    SEARCH_RICEZONE: `${API_BASE_URL}/employee/ricezone/searchzone`,
    GET_eINVOICES: `${API_BASE_URL}/employee/invoices`,
    INVOICE_PACKAGElist: `${API_BASE_URL}/employee/packageList`,
    INVOICE_CREATE: `${API_BASE_URL}/employee/invoice/invoice-create`,
    GET_eINVOICES_DETAILS: `${API_BASE_URL}/employee/invoice-detail`,
  },
  STORE_OWNER: {
    GET_INVOICES: `${API_BASE_URL}/store-owner/invoices`,
    GET_INVOICE_DETAIL: `${API_BASE_URL}/store-owner/invoice-details`,
    GET_STORE: `${API_BASE_URL}/store-owner/stores`,
    GET_STORE_PRODUCTS: `${API_BASE_URL}/store-owner/products`,
    GET_STORE_EMPLOYEES: `${API_BASE_URL}/store-owner/employees`,
    GET_STORE_STATISTICs: `${API_BASE_URL}/store-owner/statistics`,
    GET_STORE_PRODUCT_DETAIL: `${API_BASE_URL}/store-owner/product-detail`,
    GET_CATEGORIES: `${API_BASE_URL}/store-owner/all/category`,
    UPDATE_STORE_PRODUCT: `${API_BASE_URL}/store-owner/product/update`,
    GET_ATTRIBUTES: `${API_BASE_URL}/store-owner/all/attribute`,
    GET_ZONES: `${API_BASE_URL}/store-owner/store/zone`,
    UPLOAD_PRODUCT_IMAGE: `${API_BASE_URL}/store-owner/product/upload-image`,
    DELETE_STORE_PRODUCT: `${API_BASE_URL}/store-owner/product/delete`,
    GET_STORE_EMPLOYEE_DETAIL: `${API_BASE_URL}/store-owner/employee-detail`,
    UPLOAD_EMPLOYEE_AVATAR: `${API_BASE_URL}/store-owner/employee/upload-image`,
    UPDATE_STORE_EMPLOYEE: `${API_BASE_URL}/store-owner/employee/update`,
    DELETE_STORE_EMPLOYEE: `${API_BASE_URL}/store-owner/employee/delete`,
    GET_EMPTY_ZONES: `${API_BASE_URL}/store-owner/store/empty-zone`,
  },
  STORE_DETAIL: {
    GET_STORE_ZONES: `${API_BASE_URL}/store-detail/zones`,
    GET_STORE_PRODUCTS_BY_STOREID: `${API_BASE_URL}/store-detail/products`,
    UPDATE_STORE_ZONE: (id) => `${API_BASE_URL}/store-detail/zones/${id}`,
    GET_ZONE_ID: `${API_BASE_URL}/store-detail/get-zone`,
    GET_CATEGORIES_BY_STOREID: `${API_BASE_URL}/store-detail/categories`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    INTROSPECT: `${API_BASE_URL}/auth/introspect`,
    CHECK_EMAIL_PHONE: `${API_BASE_URL}/auth/check-email-phone`,
    CHECK_USERNAME: (username) => `${API_BASE_URL}/auth/check-username/${username}`,
    CHECK_USERNAME: (username) =>
      `${API_BASE_URL}/auth/check-username/${username}`,
    SEND_OTP: (key) => `${API_BASE_URL}/auth/send-otp/${key}`,
    CHECK_OTP: `${API_BASE_URL}/auth/check-otp`,
  },
  PUBLIC: {
    // UPLOAD_IMG: `${API_BASE_URL}/image`

    UPLOAD_IMG: `${API_BASE_URL}/image`,
    SUBSCRIPTION_PLAN: `${API_BASE_URL}/service-web`,
  },
  VNPAY: {
    CREATE_PAYMENT: (amount, subscriptionPlanId) =>
      `${API_BASE_URL}/vnpay/create-payment?amount=${amount}&subscriptionPlanId=${subscriptionPlanId}`,
    PAYMENT_TRANSACTION: `${API_BASE_URL}/vnpay/payment-history`,
  },
};

export default API;
