# Pet Haven Portal - Angular Frontend

A modern, scalable Angular application for managing animal shelters, built with Angular 20, Material Design, and reactive programming principles.

## 🚀 Features

- **Animal Management**: Create, read, update animals with detailed information
- **Shelter Management**: Manage shelter locations and environments
- **User Management**: Complete user administration with role-based access
- **Authentication**: Ready for JWT-based authentication (backend integration pending)
- **Responsive Design**: Mobile-first approach with Angular Material
- **Modern Architecture**: Standalone components, lazy loading, and route guards
- **State Management**: Reactive programming with RxJS
- **Error Handling**: Global error interceptor with user-friendly notifications

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
   
   Update `src/environments/environment.ts` with your API Gateway URL:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8765',  // Your API Gateway URL
     endpoints: {
       animals: '/animal-microservice/animals',
       shelters: '/shelter-microservice/shelters',
       users: '/user-microservice/users'
     }
   };
   ```

## 🚀 Development

Run the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes.

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
│   ├── services/                  # API, Animal, Shelter, User, Auth, Loading
│   ├── guards/                    # Auth and Role guards
│   ├── interceptors/              # HTTP interceptors
│   └── models/                    # TypeScript interfaces
├── features/                      # Feature modules (lazy-loaded)
│   ├── animals/                   # Animal management
│   ├── shelters/                  # Shelter management
│   ├── users/                     # User management
│   └── auth/                      # Authentication
├── shared/                        # Shared components
│   └── components/                # Navbar, Footer, Loading, Dialog
└── app.routes.ts                  # Application routing
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

## 🔐 Authentication

Authentication is currently prepared but not active. To enable:

1. Uncomment route guards in `app.routes.ts`
2. Implement login logic in `AuthService`
3. Update backend to provide JWT tokens
4. Configure CORS on backend for Angular app

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

## 🐛 Known Issues

- Authentication endpoints not yet implemented in backend
- JWT token handling prepared but not active
- File upload for animal photos to be implemented

## 🔮 Future Enhancements

- [ ] Implement full authentication flow
- [ ] Add pagination and filtering
- [ ] Implement file upload for animal photos
- [ ] Add real-time updates with WebSockets
- [ ] Implement NgRx for complex state management
- [ ] Add PWA capabilities
- [ ] Internationalization (i18n)
- [ ] Advanced search and filtering
- [ ] Export/Import functionality
- [ ] Dashboard with analytics

## 📄 License

This project is part of the Pet Haven Portal microservices application.

## 👥 Team

Frontend Team - Pet Haven Portal

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Refer to the implementation guide: `angular-frontend-implementation-guide.md`

---

**Built with ❤️ using Angular 20**
