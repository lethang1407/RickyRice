const API_BASE_URL = "http://localhost:9999";

const API = {
  ADMIN: {
    GET_ALL_ACCOUNT: `${API_BASE_URL}/admin/account-owner`,
    GET_ACCOUNT_BY_ID: (id) => `${API_BASE_URL}/admin/account/${id}`,
    UPDATE_ACCOUNT_STATUS: `${API_BASE_URL}/admin/account-active`,
    VIEW_REVENUE: `${API_BASE_URL}/admin/view-revenue`,
    VIEW_ALL_STORE: `${API_BASE_URL}/admin/view-store`,
    VIEW_ALL_SUBSCRIPTION_PLAN: `${API_BASE_URL}/admin/subscription-plans`,
    VIEW_SUBSCRIPTION_PLAN_BY_ID: (id) => `${API_BASE_URL}/admin/subscription-plan/${id}`,
    CREATE_SUBSCRIPTION_PLAN: `${API_BASE_URL}/admin/create-subscription-plan`,
    UPDATE_SUBSCRIPTION_PLAN: (id) => `${API_BASE_URL}/admin/update-subscription-plan/${id}`,
    GET_NOTIFICATIONS_BY_ID: (id) => `${API_BASE_URL}/admin/notifications/${id}`,
    MARK_NOTI_AS_READ: `${API_BASE_URL}/admin/notifications/mark-as-read`
  },
  CUSTOMER:{
    GET_ALL_PRODUCT: `${API_BASE_URL}/store/products`
  },
  EMPLOYEE:{
    GET_ALL_CUSTOMER: `${API_BASE_URL}/employee/customers`,
    UPDATE_USER: (id) => `${API_BASE_URL}/employee/customers/edit/${id}`,
    CREATE_CUSTOMER: `${API_BASE_URL}/employee/customers/create`,
    GET_CATEGORY_PAGINATION: `${API_BASE_URL}/employee/categories/pagination`,
    GET_ALL_CATEGORY: `${API_BASE_URL}/employee/categories`,
    GET_CATEGORY_BY_NAME: `${API_BASE_URL}/employee/category`,
    GET_PRODUCTS_BY_CATEGORY: `${API_BASE_URL}/employee/products-by-category`,
    GET_PRODUCTS_BY_NAME: `${API_BASE_URL}/employee/products-by-name`,
    GET_RICEZONE: `${API_BASE_URL}/employee/ricezone`,
    SEARCH_RICEZONE: `${API_BASE_URL}/employee/ricezone/searchzone`,
  },
  STORE_OWNER:{
    GET_INVOICES: `${API_BASE_URL}/store-owner/invoices`,
    GET_INVOICE_DETAIL: `${API_BASE_URL}/store-owner/invoice-details`,
    GET_STORE: `${API_BASE_URL}/store-owner/stores`,
    GET_STORE_PRODUCTS: `${API_BASE_URL}/store-owner/products`
  },
  AUTH:{
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    LOGOUT:`${API_BASE_URL}/auth/logout`, 
    INTROSPECT: `${API_BASE_URL}/auth/introspect`,
    CHECK_EMAIL_PHONE: `${API_BASE_URL}/auth/check-email-phone`, 
    CHECK_USERNAME: (username) => `${API_BASE_URL}/auth/check-username/${username}`,
    SEND_OTP:(key) => `${API_BASE_URL}/auth/send-otp/${key}`,
    CHECK_OTP: `${API_BASE_URL}/auth/check-otp`,
  },
  PUBLIC:{
    UPLOAD_IMG: `${API_BASE_URL}/image`
  }
};

export default API;