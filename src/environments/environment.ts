export const environment = {
  production: false,
  apiUrl: 'http://localhost:8765',  // API Gateway URL
  endpoints: {
    animals: '/animal-microservice/animals',
    shelters: '/shelter-microservice/shelters',
    users: '/user-microservice/users',
    userManagement: '/user-management'
  },
  // Authentication endpoints
  auth: {
    login: '/user-management/auth/login',
    register: '/user-management/auth/register',
    refresh: '/user-management/auth/refresh',
    logout: '/user-management/auth/logout'
  }
};

