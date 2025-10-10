# Pet Haven Portal - Angular Frontend

A modern, scalable Angular application for managing animal shelters, built with Angular 20, Material Design, and enterprise-grade security features.

## 🚀 Features

- **Animal Management**: Create, read, update, and delete animals with detailed information
- **Shelter Management**: Manage shelter locations and environments
- **User Management**: Complete user administration with role-based access control
- **🔐 Enterprise Security**: JWT authentication with automatic token refresh
- **🛡️ Role-Based Access**: USER, ADMIN, MANAGER, OWNER permission levels
- **📱 Responsive Design**: Mobile-first approach with Angular Material
- **🏗️ Modern Architecture**: Standalone components, lazy loading, and route guards
- **⚡ State Management**: Reactive programming with RxJS
- **⚠️ Error Handling**: Comprehensive error management with user-friendly notifications
- **🔄 Auto Token Refresh**: Seamless user experience with background token renewal

## 📋 Prerequisites

- **Node.js**: 22.19.0 or higher
- **npm**: 11.6.0 or higher
- **Angular CLI**: 20.3.2

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pet-haven-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   The environment is already configured for the microservices architecture:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8765',  // API Gateway URL
     endpoints: {
       animals: '/animal-microservice/animals',
       shelters: '/shelter-microservice/shelters',
       users: '/user-microservice/users',
       userManagement: '/user-management'
     },
     auth: {
       login: '/user-management/auth/login',
       register: '/user-management/auth/register',
       refresh: '/user-management/auth/refresh',
       logout: '/user-management/auth/logout'
     }
   };
   ```

4. **Start Backend Services**
   
   Ensure your Java Spring Boot microservices are running:
   - API Gateway (port 8765)
   - User Management Service
   - Animal Microservice
   - Shelter Microservice
   - User Microservice

## 🚀 Development

Run the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes.

### 🔐 Authentication Flow

1. **Access the application** - You'll be redirected to `/login` if not authenticated
2. **Register a new account** - Navigate to `/auth/register` to create an account
3. **Login** - Use your credentials to access the application
4. **Automatic token refresh** - Tokens are automatically renewed in the background
5. **Role-based access** - Different features based on your user role

### 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **HttpOnly Cookies**: Refresh tokens stored securely
- **Automatic Token Refresh**: Seamless user experience
- **Route Protection**: Guards for authenticated routes
- **Role-Based Access**: Fine-grained permission control
- **Error Handling**: Comprehensive error management

## 🏗️ Build

Build the project for production:

```bash
npm run build:prod
```

The build artifacts will be stored in the `dist/` directory.

## 📦 Project Structure

```
src/app/
├── core/                          # Singleton services, guards, interceptors
│   ├── services/                  # API, Animal, Shelter, User, Auth, Loading, ErrorHandler
│   ├── guards/                    # Auth and Role guards (reactive)
│   ├── interceptors/              # HTTP interceptors (Auth, Error, Loading)
│   └── models/                    # TypeScript interfaces
├── features/                     # Feature modules (lazy-loaded)
│   ├── animals/                   # Animal management (authenticated)
│   ├── shelters/                  # Shelter management (authenticated)
│   ├── users/                     # User management (role-based)
│   ├── auth/                      # Authentication (login/register)
│   └── error/                     # Error pages (unauthorized, not-found)
├── shared/                        # Shared components
│   └── components/                # Navbar, Footer, Loading, Dialog
└── app.routes.ts                  # Application routing with guards
```

## 🎯 Key Technologies

- **Angular 20**: Latest version with standalone components
- **Angular Material**: Material Design UI components
- **RxJS**: Reactive programming
- **TypeScript 5.9**: Strong typing and modern JavaScript features
- **SCSS**: Advanced styling capabilities

## 🔧 Architecture Principles

This application follows enterprise-grade Angular best practices:

### SOLID Principles
- **Single Responsibility**: Each component/service has one clear purpose
- **Open/Closed**: Extensible through inheritance and composition
- **Liskov Substitution**: Interfaces ensure proper substitutability
- **Interface Segregation**: Specific interfaces for specific needs
- **Dependency Inversion**: Depend on abstractions, not concretions

### Angular Best Practices
- ✅ Standalone components for better tree-shaking
- ✅ Lazy loading for optimal performance
- ✅ Dependency Injection for loose coupling
- ✅ Reactive programming with RxJS
- ✅ OnPush change detection strategy ready
- ✅ Route guards for security
- ✅ HTTP interceptors for cross-cutting concerns
- ✅ Unidirectional data flow
- ✅ Clean separation of concerns

## 🌐 API Integration

The application connects to microservices through an API Gateway (default: `http://localhost:8765`).

### Endpoints

**Animals**
- `GET /animal-microservice/animals/getAll`
- `GET /animal-microservice/animals/getById/{id}`
- `POST /animal-microservice/animals`
- `PUT /animal-microservice/animals`

**Shelters**
- `GET /shelter-microservice/shelters/getAll`
- `GET /shelter-microservice/shelters/getAllAnimals`
- `POST /shelter-microservice/shelters/add`
- `PUT /shelter-microservice/shelters/update`

**Users**
- `GET /user-microservice/users`
- `GET /user-microservice/users/find/{email}`
- `POST /user-microservice/users/add`
- `PUT /user-microservice/users/update`
- `DELETE /user-microservice/users/delete/{id}`

## 🔐 Authentication & Security

The application features **enterprise-grade security** with complete JWT authentication:

### 🔑 Authentication Features
- **JWT Tokens**: Access tokens (15 min) + HttpOnly refresh tokens (7 days)
- **Automatic Token Refresh**: Seamless background token renewal
- **Route Protection**: All routes protected with authentication guards
- **Role-Based Access**: USER, ADMIN, MANAGER, OWNER permission levels
- **Secure Storage**: Tokens stored securely with XSS protection
- **Error Handling**: Comprehensive authentication error management

### 🛡️ Security Implementation
- **AuthService**: Complete JWT authentication with automatic refresh
- **HTTP Interceptor**: Automatic token injection and refresh handling
- **Route Guards**: Authentication and role-based access control
- **Error Handler**: Centralized error management for security scenarios
- **Form Validation**: Client-side validation with security best practices

### 🔒 User Roles
- **USER**: Basic access to animals and shelters
- **ADMIN**: Full system access including user management
- **MANAGER**: Management access to animals and shelters
- **OWNER**: Complete system ownership and administration

## 🧪 Testing

Run unit tests:

```bash
npm test
```

Run tests in CI mode:

```bash
npm run test:ci
```

## 🎨 Code Style

This project uses Prettier for code formatting:

```bash
npm run format
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1400px+)
- Tablet (768px - 1399px)
- Mobile (< 768px)

## 🚢 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build:prod
```

### Docker Deployment

Build Docker image:
```bash
docker build -t pet-haven-frontend .
```

Run container:
```bash
docker run -p 80:80 pet-haven-frontend
```

## 🎯 Quick Start Guide

### 1. **Start Backend Services**
```bash
# Ensure your Java Spring Boot microservices are running
# - API Gateway (port 8765)
# - User Management Service
# - Animal, Shelter, User Microservices
```

### 2. **Start Frontend**
```bash
npm start
# Navigate to http://localhost:4200
```

### 3. **Test Authentication**
1. **Register**: Go to `/auth/register` to create an account
2. **Login**: Use your credentials at `/login`
3. **Explore**: Access protected routes like `/animals`, `/shelters`
4. **Test Roles**: Try accessing `/users` (requires ADMIN/MANAGER/OWNER role)

## 🔮 Future Enhancements

- [ ] Multi-factor authentication (MFA)
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Advanced role management
- [ ] Audit logging
- [ ] File upload for animal photos
- [ ] Real-time updates with WebSockets
- [ ] NgRx for complex state management
- [ ] PWA capabilities
- [ ] Internationalization (i18n)
- [ ] Advanced search and filtering
- [ ] Export/Import functionality
- [ ] Dashboard with analytics

## 📄 License

This project is part of the Pet Haven Portal microservices application.

## 👥 Team

Frontend Team - Pet Haven Portal

## 📚 Documentation

- **Security Implementation**: `SECURITY_IMPLEMENTATION_SUMMARY.md` - Complete security documentation
- **Frontend Guide**: `angular-frontend-implementation-guide.md` - Detailed implementation guide
- **API Integration**: `FRONTEND_SWAGGER_INTEGRATION_GUIDE.md` - Backend integration guide

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Refer to the comprehensive documentation above

## 🏆 Security Status

✅ **Production Ready**: Enterprise-grade security implemented  
✅ **JWT Authentication**: Complete with automatic token refresh  
✅ **Role-Based Access**: Fine-grained permission control  
✅ **Route Protection**: All routes properly secured  
✅ **Error Handling**: Comprehensive error management  
✅ **Form Validation**: Security best practices implemented  

---

**🔐 Built with ❤️ using Angular 20 + Enterprise Security**
