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
    MARK_NOTI_AS_READ: `${API_BASE_URL}/notifications/mark-as-read`
  },
  CUSTOMER:{
    GET_ALL_PRODUCT: `${API_BASE_URL}/store/products`
  },
  EMPLOYEE:{
    GET_ALL_CATEGORY: ``
  }
};

export default API;