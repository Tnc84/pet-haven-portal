# Frontend Swagger Integration Guide
## Pet Haven Portal - Microservices API Integration

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Swagger UI Access Points](#swagger-ui-access-points)
3. [API Documentation Endpoints](#api-documentation-endpoints)
4. [Frontend Integration Options](#frontend-integration-options)
5. [Available API Endpoints](#available-api-endpoints)
6. [TypeScript Interface Examples](#typescript-interface-examples)
7. [Angular Service Examples](#angular-service-examples)
8. [Environment Configuration](#environment-configuration)
9. [HTTP Interceptor Examples](#http-interceptor-examples)
10. [CORS Configuration](#cors-configuration)
11. [Testing Guide](#testing-guide)
12. [Code Generation Commands](#code-generation-commands)
13. [Best Practices](#best-practices)
14. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Access Swagger UI (3 Easy Steps)

1. **Ensure Backend Services are Running**
   ```bash
   # Start Eureka Server (port 8761)
   # Start API Gateway (port 8765)
   # Start all microservices
   ```

2. **Access Swagger UI**
   - **API Gateway**: http://localhost:8765/swagger-ui.html
   - **Animal Service**: http://localhost:8081/swagger-ui.html
   - **Shelter Service**: http://localhost:8082/swagger-ui.html
   - **User Service**: http://localhost:8083/swagger-ui.html

3. **Test Endpoints Interactively**
   - Click on any endpoint
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
   - View response

---

## Swagger UI Access Points

### API Gateway (Aggregated Documentation)
```
URL: http://localhost:8765/swagger-ui.html
Description: Unified API documentation for all microservices
Recommended: Use this for production integration
```

### Individual Microservices

#### Animal Microservice
```
Swagger UI: http://localhost:8081/swagger-ui.html
Port: 8081
Service Name: animal-microservice
Base Path: /animal-microservice
```

#### Shelter Microservice
```
Swagger UI: http://localhost:8082/swagger-ui.html
Port: 8082
Service Name: shelter-microservice
Base Path: /shelter-microservice
```

#### User Microservice
```
Swagger UI: http://localhost:8083/swagger-ui.html
Port: 8083
Service Name: user-microservice
Base Path: /user-microservice
```

---

## API Documentation Endpoints

### OpenAPI JSON Specifications

Access raw OpenAPI 3.0 specifications for programmatic consumption:

```typescript
// API Gateway (All services)
http://localhost:8765/v3/api-docs

// Individual services
http://localhost:8081/v3/api-docs  // Animal Service
http://localhost:8082/v3/api-docs  // Shelter Service
http://localhost:8083/v3/api-docs  // User Service

// Grouped by service name via Gateway
http://localhost:8765/v3/api-docs/animal-microservice
http://localhost:8765/v3/api-docs/shelter-microservice
http://localhost:8765/v3/api-docs/user-microservice
```

### Download OpenAPI Spec

```bash
# Download complete API specification
curl http://localhost:8765/v3/api-docs > api-spec.json

# Download specific service spec
curl http://localhost:8081/v3/api-docs > animal-service-spec.json
curl http://localhost:8082/v3/api-docs > shelter-service-spec.json
curl http://localhost:8083/v3/api-docs > user-service-spec.json
```

---

## Frontend Integration Options

### Option 1: Direct API Consumption (Current Implementation ✅)

**Pros**: Full control, no dependencies, already implemented  
**Cons**: Manual model creation and updates

```typescript
// Already implemented in the project
import { AnimalService } from './core/services/animal.service';

constructor(private animalService: AnimalService) {}

this.animalService.getAllAnimals().subscribe(animals => {
  console.log(animals);
});
```

### Option 2: OpenAPI Generator (Recommended for Large Projects)

**Pros**: Automated, type-safe, always in sync  
**Cons**: Requires build step, generated code can be verbose

#### Setup OpenAPI Generator

```bash
# Install globally
npm install -g @openapitools/openapi-generator-cli

# Or as dev dependency
npm install --save-dev @openapitools/openapi-generator-cli
```

#### Generate TypeScript Angular Client

```bash
# Generate from API Gateway
openapi-generator-cli generate \
  -i http://localhost:8765/v3/api-docs \
  -g typescript-angular \
  -o src/app/generated/api \
  --additional-properties=ngVersion=20,providedInRoot=true

# Generate for specific service
openapi-generator-cli generate \
  -i http://localhost:8081/v3/api-docs \
  -g typescript-angular \
  -o src/app/generated/animal-api \
  --additional-properties=ngVersion=20,providedInRoot=true
```

#### Add to package.json

```json
{
  "scripts": {
    "generate:api": "openapi-generator-cli generate -i http://localhost:8765/v3/api-docs -g typescript-angular -o src/app/generated/api --additional-properties=ngVersion=20,providedInRoot=true",
    "generate:api:animal": "openapi-generator-cli generate -i http://localhost:8081/v3/api-docs -g typescript-angular -o src/app/generated/animal-api",
    "generate:api:shelter": "openapi-generator-cli generate -i http://localhost:8082/v3/api-docs -g typescript-angular -o src/app/generated/shelter-api",
    "generate:api:user": "openapi-generator-cli generate -i http://localhost:8083/v3/api-docs -g typescript-angular -o src/app/generated/user-api"
  }
}
```

#### Use Generated Services

```typescript
import { AnimalControllerService, Animal } from './generated/api';

constructor(private animalApi: AnimalControllerService) {}

// All methods are type-safe and auto-generated
this.animalApi.getAllAnimals().subscribe(animals => {
  console.log(animals);
});
```

### Option 3: Swagger Codegen

**Pros**: Mature, stable  
**Cons**: Less actively maintained than OpenAPI Generator

```bash
# Install Swagger Codegen
npm install -g swagger-codegen

# Generate TypeScript client
swagger-codegen generate \
  -i http://localhost:8765/v3/api-docs \
  -l typescript-angular \
  -o src/app/generated/swagger-api
```

### Option 4: ng-openapi-gen (Angular-Specific)

**Pros**: Angular-optimized, lightweight  
**Cons**: Less feature-rich

```bash
# Install
npm install --save-dev ng-openapi-gen

# Generate
ng-openapi-gen --input http://localhost:8765/v3/api-docs --output src/app/api
```

---

## Available API Endpoints

### Animal Microservice

#### Base URL
```
Gateway: http://localhost:8765/animal-microservice
Direct: http://localhost:8081
```

#### Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/animals/getAll` | Get all animals | - | `Animal[]` |
| GET | `/animals/getById/{id}` | Get animal by ID | - | `Animal` |
| POST | `/animals` | Create new animal | `Animal` (no id) | `Animal` |
| PUT | `/animals` | Update existing animal | `Animal` (with id) | `Animal` |

#### Animal Model

```typescript
interface Animal {
  id: number | null;
  name: string;
  breed: string;
  species: string;
  photo: string;
  environment: string;
}
```

#### Example Requests

```typescript
// GET all animals
GET http://localhost:8765/animal-microservice/animals/getAll

// GET animal by ID
GET http://localhost:8765/animal-microservice/animals/getById/1

// POST create animal
POST http://localhost:8765/animal-microservice/animals
Content-Type: application/json

{
  "name": "Max",
  "breed": "Golden Retriever",
  "species": "Dog",
  "photo": "https://example.com/max.jpg",
  "environment": "production"
}

// PUT update animal
PUT http://localhost:8765/animal-microservice/animals
Content-Type: application/json

{
  "id": 1,
  "name": "Max Updated",
  "breed": "Golden Retriever",
  "species": "Dog",
  "photo": "https://example.com/max.jpg",
  "environment": "production"
}
```

---

### Shelter Microservice

#### Base URL
```
Gateway: http://localhost:8765/shelter-microservice
Direct: http://localhost:8082
```

#### Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/shelters/getAll` | Get all shelters | - | `Shelter[]` |
| GET | `/shelters/getAllAnimals` | Get all animals via Feign | - | `Animal[]` |
| POST | `/shelters/add` | Create new shelter | `Shelter` (no id) | `Shelter` |
| PUT | `/shelters/update` | Update existing shelter | `Shelter` (with id) | `Shelter` |

#### Shelter Model

```typescript
interface Shelter {
  id: number | null;
  name: string;
  city: string;
  environment: string;
}
```

#### Example Requests

```typescript
// GET all shelters
GET http://localhost:8765/shelter-microservice/shelters/getAll

// GET all animals (via Feign Client)
GET http://localhost:8765/shelter-microservice/shelters/getAllAnimals

// POST create shelter
POST http://localhost:8765/shelter-microservice/shelters/add
Content-Type: application/json

{
  "name": "Happy Paws Shelter",
  "city": "San Francisco",
  "environment": "production"
}

// PUT update shelter
PUT http://localhost:8765/shelter-microservice/shelters/update
Content-Type: application/json

{
  "id": 1,
  "name": "Happy Paws Shelter Updated",
  "city": "San Francisco",
  "environment": "production"
}
```

---

### User Microservice

#### Base URL
```
Gateway: http://localhost:8765/user-microservice
Direct: http://localhost:8083
```

#### Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/users` | Get all users | - | `User[]` |
| GET | `/users/find/{email}` | Find user by email | - | `User` |
| POST | `/users/add` | Create new user | `User` (no id) | `User` |
| PUT | `/users/update` | Update existing user | `User` (with id) | `User` |
| DELETE | `/users/delete/{id}` | Delete user by ID | - | `HttpResponse` |
| GET | `/users/resetPassword/{email}` | Reset user password | - | `HttpResponse` |

#### User Model

```typescript
interface User {
  id: number | null;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  lastLoginDate: Date | null;
  lastLoginDateDisplay: Date | null;
  joinDate: Date | null;
  role: string; // 'USER', 'ADMIN', 'MANAGER', 'OWNER'
  authorities: string[];
  isActive: boolean;
  isNotLocked: boolean;
}
```

#### Example Requests

```typescript
// GET all users
GET http://localhost:8765/user-microservice/users

// GET user by email
GET http://localhost:8765/user-microservice/users/find/john@example.com

// POST create user
POST http://localhost:8765/user-microservice/users/add
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "USER",
  "isActive": true,
  "isNotLocked": true
}

// PUT update user
PUT http://localhost:8765/user-microservice/users/update
Content-Type: application/json

{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "ADMIN",
  "isActive": true,
  "isNotLocked": true
}

// DELETE user
DELETE http://localhost:8765/user-microservice/users/delete/1

// GET reset password
GET http://localhost:8765/user-microservice/users/resetPassword/john@example.com
```

---

## TypeScript Interface Examples

### Complete Type Definitions

Create `src/app/core/models/api-types.ts`:

```typescript
/**
 * Base Response Types
 */
export interface HttpResponse {
  httpStatusCode: number;
  httpStatus: string;
  reason: string;
  message: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

/**
 * Animal Domain
 */
export interface Animal {
  id: number | null;
  name: string;
  breed: string;
  species: string;
  photo: string;
  environment: string;
}

export interface AnimalCreateRequest {
  name: string;
  breed: string;
  species: string;
  photo: string;
  environment: string;
}

export interface AnimalUpdateRequest extends AnimalCreateRequest {
  id: number;
}

/**
 * Shelter Domain
 */
export interface Shelter {
  id: number | null;
  name: string;
  city: string;
  environment: string;
}

export interface ShelterCreateRequest {
  name: string;
  city: string;
  environment: string;
}

export interface ShelterUpdateRequest extends ShelterCreateRequest {
  id: number;
}

/**
 * User Domain
 */
export interface User {
  id: number | null;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  lastLoginDate: Date | null;
  lastLoginDateDisplay: Date | null;
  joinDate: Date | null;
  role: UserRole;
  authorities: string[];
  isActive: boolean;
  isNotLocked: boolean;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  OWNER = 'OWNER'
}

export interface UserCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole | string;
  isActive: boolean;
  isNotLocked: boolean;
}

export interface UserUpdateRequest extends UserCreateRequest {
  id: number;
}

/**
 * Authentication
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

/**
 * Pagination
 */
export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
```

---

## Angular Service Examples

### Enhanced Service with Swagger Integration

Create `src/app/core/services/enhanced-animal.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Animal, AnimalCreateRequest, AnimalUpdateRequest } from '../models/api-types';

/**
 * Enhanced Animal Service with complete Swagger integration
 * 
 * Swagger Docs: http://localhost:8765/swagger-ui.html#/animal-controller
 * OpenAPI Spec: http://localhost:8765/v3/api-docs/animal-microservice
 */
@Injectable({
  providedIn: 'root'
})
export class EnhancedAnimalService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.animals}`;

  constructor(private http: HttpClient) {}

  /**
   * GET /animals/getAll
   * @returns Observable<Animal[]>
   * @swagger GET /animal-microservice/animals/getAll
   */
  getAllAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.baseUrl}/getAll`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * GET /animals/getById/{id}
   * @param id Animal ID
   * @returns Observable<Animal>
   * @swagger GET /animal-microservice/animals/getById/{id}
   */
  getAnimalById(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.baseUrl}/getById/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * POST /animals
   * @param animal Animal data (without ID)
   * @returns Observable<Animal>
   * @swagger POST /animal-microservice/animals
   */
  createAnimal(animal: AnimalCreateRequest): Observable<Animal> {
    return this.http.post<Animal>(this.baseUrl, animal).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * PUT /animals
   * @param animal Animal data (with ID)
   * @returns Observable<Animal>
   * @swagger PUT /animal-microservice/animals
   */
  updateAnimal(animal: AnimalUpdateRequest): Observable<Animal> {
    return this.http.put<Animal>(this.baseUrl, animal).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Search animals by name (if backend supports it)
   * @param name Search term
   * @returns Observable<Animal[]>
   */
  searchAnimalsByName(name: string): Observable<Animal[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Animal[]>(`${this.baseUrl}/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    console.error('Animal Service Error:', error);
    return throwError(() => error);
  }
}
```

### Service with Response Mapping

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MappedAnimalService {
  private readonly baseUrl = 'http://localhost:8765/animal-microservice/animals';

  constructor(private http: HttpClient) {}

  /**
   * Get animals and transform response
   */
  getAllAnimalsWithTransform(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.baseUrl}/getAll`).pipe(
      map(animals => animals.map(animal => ({
        ...animal,
        displayName: `${animal.name} (${animal.species})`,
        photoUrl: animal.photo || '/assets/default-animal.jpg'
      })))
    );
  }
}
```

---

## Environment Configuration

### Update Angular Environment Files

`src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8765',
  
  // Microservice endpoints (via API Gateway)
  endpoints: {
    animals: '/animal-microservice/animals',
    shelters: '/shelter-microservice/shelters',
    users: '/user-microservice/users'
  },
  
  // Swagger URLs for development
  swagger: {
    gateway: 'http://localhost:8765/swagger-ui.html',
    animalService: 'http://localhost:8081/swagger-ui.html',
    shelterService: 'http://localhost:8082/swagger-ui.html',
    userService: 'http://localhost:8083/swagger-ui.html'
  },
  
  // OpenAPI Spec URLs
  openapi: {
    gateway: 'http://localhost:8765/v3/api-docs',
    animalService: 'http://localhost:8081/v3/api-docs',
    shelterService: 'http://localhost:8082/v3/api-docs',
    userService: 'http://localhost:8083/v3/api-docs'
  },
  
  // Feature flags
  features: {
    enableSwaggerDocs: true,
    enableDebugMode: true,
    enableMockData: false
  }
};
```

`src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.pethaven.com',
  
  endpoints: {
    animals: '/animal-microservice/animals',
    shelters: '/shelter-microservice/shelters',
    users: '/user-microservice/users'
  },
  
  swagger: {
    gateway: 'https://api.pethaven.com/swagger-ui.html',
    animalService: undefined,
    shelterService: undefined,
    userService: undefined
  },
  
  openapi: {
    gateway: 'https://api.pethaven.com/v3/api-docs',
    animalService: undefined,
    shelterService: undefined,
    userService: undefined
  },
  
  features: {
    enableSwaggerDocs: false,
    enableDebugMode: false,
    enableMockData: false
  }
};
```

---

## HTTP Interceptor Examples

### API Gateway Routing Interceptor

Already implemented in `src/app/core/interceptors/auth.interceptor.ts` ✅

### Enhanced Error Interceptor with Swagger Error Mapping

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const swaggerErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      // Map Swagger/OpenAPI error responses
      if (error.error) {
        // OpenAPI standard error format
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        // Spring Boot error format
        else if (error.error.error && error.error.message) {
          errorMessage = `${error.error.error}: ${error.error.message}`;
        }
        // Custom error format
        else if (typeof error.error === 'string') {
          errorMessage = error.error;
        }
      }

      // HTTP status code handling
      switch (error.status) {
        case 400:
          errorMessage = `Bad Request: ${errorMessage}`;
          break;
        case 401:
          errorMessage = 'Unauthorized - Please login';
          break;
        case 403:
          errorMessage = 'Forbidden - Insufficient permissions';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Internal Server Error';
          break;
        case 503:
          errorMessage = 'Service Unavailable - Please try again later';
          break;
      }

      snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });

      return throwError(() => error);
    })
  );
};
```

### Request Logging Interceptor (Development Only)

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.production && environment.features.enableDebugMode) {
    console.group(`🌐 HTTP Request: ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.groupEnd();
  }

  const startTime = Date.now();

  return next(req).pipe(
    tap({
      next: (response) => {
        if (!environment.production && environment.features.enableDebugMode) {
          const duration = Date.now() - startTime;
          console.group(`✅ HTTP Response: ${req.method} ${req.url} (${duration}ms)`);
          console.log('Response:', response);
          console.groupEnd();
        }
      },
      error: (error) => {
        if (!environment.production && environment.features.enableDebugMode) {
          const duration = Date.now() - startTime;
          console.group(`❌ HTTP Error: ${req.method} ${req.url} (${duration}ms)`);
          console.error('Error:', error);
          console.groupEnd();
        }
      }
    })
  );
};
```

---

## CORS Configuration

### Backend CORS Setup (Spring Boot)

The backend should already have CORS configured. If not, add to `application.yml`:

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins:
              - "http://localhost:4200"
              - "http://localhost:8081"
              - "http://localhost:8082"
              - "http://localhost:8083"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders:
              - "*"
            allowCredentials: true
            maxAge: 3600
```

### Frontend Proxy Configuration (Development)

Create `proxy.conf.json` in the project root:

```json
{
  "/animal-microservice": {
    "target": "http://localhost:8765",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/shelter-microservice": {
    "target": "http://localhost:8765",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/user-microservice": {
    "target": "http://localhost:8765",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/v3/api-docs": {
    "target": "http://localhost:8765",
    "secure": false,
    "changeOrigin": true
  }
}
```

Update `package.json`:

```json
{
  "scripts": {
    "start": "ng serve --proxy-config proxy.conf.json"
  }
}
```

### Angular CORS Handling

```typescript
// No special handling needed - browser manages CORS
// Just ensure backend allows your origin

// For development, use proxy.conf.json
// For production, ensure backend CORS config includes your domain
```

---

## Testing Guide

### Test APIs with Swagger UI

#### Step 1: Access Swagger UI
```
http://localhost:8765/swagger-ui.html
```

#### Step 2: Authorize (if JWT is enabled)
1. Click "Authorize" button
2. Enter: `Bearer <your-jwt-token>`
3. Click "Authorize"
4. Click "Close"

#### Step 3: Test Endpoints

**Example: Create an Animal**

1. Expand `animal-controller`
2. Click `POST /animal-microservice/animals`
3. Click "Try it out"
4. Enter request body:
```json
{
  "name": "Buddy",
  "breed": "Labrador",
  "species": "Dog",
  "photo": "https://example.com/buddy.jpg",
  "environment": "production"
}
```
5. Click "Execute"
6. View response:
   - Code: 200 (success)
   - Response body shows created animal with ID

**Example: Get All Animals**

1. Expand `animal-controller`
2. Click `GET /animal-microservice/animals/getAll`
3. Click "Try it out"
4. Click "Execute"
5. View response with array of animals

### Test with Postman

#### Import OpenAPI Spec

1. Open Postman
2. Click "Import"
3. Select "Link"
4. Enter: `http://localhost:8765/v3/api-docs`
5. Click "Continue"
6. Click "Import"
7. All endpoints are now available in Postman

#### Environment Setup

Create Postman environment:

```json
{
  "name": "Pet Haven - Local",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8765",
      "enabled": true
    },
    {
      "key": "jwtToken",
      "value": "",
      "enabled": true
    }
  ]
}
```

### Test with cURL

```bash
# Get all animals
curl -X GET "http://localhost:8765/animal-microservice/animals/getAll" \
  -H "accept: application/json"

# Create animal
curl -X POST "http://localhost:8765/animal-microservice/animals" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max",
    "breed": "Golden Retriever",
    "species": "Dog",
    "photo": "photo-url",
    "environment": "production"
  }'

# Update animal
curl -X PUT "http://localhost:8765/animal-microservice/animals" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "name": "Max Updated",
    "breed": "Golden Retriever",
    "species": "Dog",
    "photo": "photo-url",
    "environment": "production"
  }'

# Get animal by ID
curl -X GET "http://localhost:8765/animal-microservice/animals/getById/1" \
  -H "accept: application/json"
```

### Automated Testing with Angular

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnimalService } from './animal.service';

describe('AnimalService - Swagger Integration', () => {
  let service: AnimalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnimalService]
    });
    service = TestBed.inject(AnimalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get all animals matching Swagger spec', () => {
    const mockAnimals = [
      { id: 1, name: 'Max', breed: 'Golden Retriever', species: 'Dog', photo: '', environment: 'prod' }
    ];

    service.getAllAnimals().subscribe(animals => {
      expect(animals.length).toBe(1);
      expect(animals[0]).toEqual(mockAnimals[0]);
    });

    const req = httpMock.expectOne('http://localhost:8765/animal-microservice/animals/getAll');
    expect(req.request.method).toBe('GET');
    req.flush(mockAnimals);
  });
});
```

---

## Code Generation Commands

### Complete Setup Guide

#### 1. Install OpenAPI Generator

```bash
# Global installation
npm install -g @openapitools/openapi-generator-cli

# Or project-specific
npm install --save-dev @openapitools/openapi-generator-cli

# Verify installation
openapi-generator-cli version
```

#### 2. Generate TypeScript Angular Client

```bash
# Create output directory
mkdir -p src/app/generated

# Generate complete API client
openapi-generator-cli generate \
  -i http://localhost:8765/v3/api-docs \
  -g typescript-angular \
  -o src/app/generated/api \
  --additional-properties=ngVersion=20,providedInRoot=true,withInterfaces=true

# Generate individual service clients
openapi-generator-cli generate \
  -i http://localhost:8081/v3/api-docs \
  -g typescript-angular \
  -o src/app/generated/animal-api \
  --additional-properties=ngVersion=20

openapi-generator-cli generate \
  -i http://localhost:8082/v3/api-docs \
  -g typescript-angular \
  -o src/app/generated/shelter-api \
  --additional-properties=ngVersion=20

openapi-generator-cli generate \
  -i http://localhost:8083/v3/api-docs \
  -g typescript-angular \
  -o src/app/generated/user-api \
  --additional-properties=ngVersion=20
```

#### 3. Configuration File Method

Create `openapitools.json`:

```json
{
  "$schema": "node_modules/@openapitools/openapi-generator-cli/config.schema.json",
  "spaces": 2,
  "generator-cli": {
    "version": "7.2.0",
    "generators": {
      "v3": {
        "generatorName": "typescript-angular",
        "output": "src/app/generated/api",
        "glob": "http://localhost:8765/v3/api-docs",
        "additionalProperties": {
          "ngVersion": "20",
          "providedInRoot": true,
          "withInterfaces": true,
          "enumPropertyNaming": "UPPERCASE"
        }
      }
    }
  }
}
```

Run generation:

```bash
npx openapi-generator-cli generate
```

#### 4. Add to package.json Scripts

```json
{
  "scripts": {
    "generate:api": "openapi-generator-cli generate",
    "generate:api:all": "npm run generate:api:animal && npm run generate:api:shelter && npm run generate:api:user",
    "generate:api:animal": "openapi-generator-cli generate -i http://localhost:8081/v3/api-docs -g typescript-angular -o src/app/generated/animal-api",
    "generate:api:shelter": "openapi-generator-cli generate -i http://localhost:8082/v3/api-docs -g typescript-angular -o src/app/generated/shelter-api",
    "generate:api:user": "openapi-generator-cli generate -i http://localhost:8083/v3/api-docs -g typescript-angular -o src/app/generated/user-api",
    "prebuild": "npm run generate:api"
  }
}
```

#### 5. Use Generated Code

```typescript
// Import generated services and models
import { 
  AnimalControllerService, 
  Animal,
  AnimalCreateRequest 
} from './generated/api';

// Inject service
constructor(private animalApi: AnimalControllerService) {}

// Use type-safe methods
getAllAnimals() {
  this.animalApi.getAllAnimals().subscribe({
    next: (animals: Animal[]) => {
      console.log('Animals:', animals);
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
```

#### 6. Update .gitignore

```gitignore
# Generated API clients
/src/app/generated/
```

---

## Best Practices

### 1. API Integration Patterns

#### Use Service Layer Pattern ✅
```typescript
// Good: Service abstracts API calls
@Injectable({ providedIn: 'root' })
export class AnimalService {
  getAllAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.baseUrl}/animals/getAll`);
  }
}

// Usage in component
this.animalService.getAllAnimals().subscribe(animals => {
  this.animals = animals;
});
```

#### Avoid Direct HTTP Calls in Components ❌
```typescript
// Bad: Direct HTTP in component
ngOnInit() {
  this.http.get('http://localhost:8765/animals/getAll')
    .subscribe(data => this.animals = data);
}
```

### 2. Error Handling

#### Implement Comprehensive Error Handling ✅
```typescript
getAllAnimals(): Observable<Animal[]> {
  return this.http.get<Animal[]>(`${this.baseUrl}/getAll`).pipe(
    retry(2), // Retry failed requests
    catchError((error: HttpErrorResponse) => {
      console.error('Error fetching animals:', error);
      
      // Log to monitoring service
      this.errorService.logError(error);
      
      // Return user-friendly error
      return throwError(() => ({
        message: 'Failed to load animals. Please try again.',
        originalError: error
      }));
    })
  );
}
```

### 3. Type Safety

#### Always Use Strong Types ✅
```typescript
// Good: Strongly typed
interface Animal {
  id: number;
  name: string;
  breed: string;
}

getAnimal(id: number): Observable<Animal> {
  return this.http.get<Animal>(`${this.baseUrl}/${id}`);
}
```

#### Avoid 'any' Type ❌
```typescript
// Bad: Weak typing
getAnimal(id: any): Observable<any> {
  return this.http.get(`${this.baseUrl}/${id}`);
}
```

### 4. Environment Configuration

#### Use Environment Variables ✅
```typescript
// Good: Environment-based configuration
import { environment } from '../../../environments/environment';

private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.animals}`;
```

#### Avoid Hardcoded URLs ❌
```typescript
// Bad: Hardcoded URL
private readonly baseUrl = 'http://localhost:8765/animal-microservice/animals';
```

### 5. Observable Management

#### Use Async Pipe in Templates ✅
```typescript
// Component
animals$ = this.animalService.getAllAnimals();

// Template
<div *ngFor="let animal of animals$ | async">
  {{ animal.name }}
</div>
```

#### Unsubscribe from Subscriptions ✅
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.animalService.getAllAnimals()
    .pipe(takeUntil(this.destroy$))
    .subscribe(animals => this.animals = animals);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### 6. API Response Caching

```typescript
@Injectable({ providedIn: 'root' })
export class AnimalService {
  private cache$ = new BehaviorSubject<Animal[] | null>(null);

  getAllAnimals(forceRefresh = false): Observable<Animal[]> {
    if (!forceRefresh && this.cache$.value) {
      return this.cache$.asObservable().pipe(
        filter(animals => animals !== null),
        take(1)
      ) as Observable<Animal[]>;
    }

    return this.http.get<Animal[]>(`${this.baseUrl}/getAll`).pipe(
      tap(animals => this.cache$.next(animals)),
      shareReplay(1)
    );
  }
}
```

### 7. Loading States

```typescript
@Component({...})
export class AnimalListComponent {
  animals: Animal[] = [];
  loading = false;
  error: string | null = null;

  loadAnimals() {
    this.loading = true;
    this.error = null;

    this.animalService.getAllAnimals().subscribe({
      next: (animals) => {
        this.animals = animals;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load animals';
        this.loading = false;
      }
    });
  }
}
```

### 8. Swagger Documentation Comments

```typescript
/**
 * Animal Service
 * 
 * @swagger AnimalController
 * @openapi http://localhost:8765/v3/api-docs/animal-microservice
 * 
 * This service provides access to animal management endpoints.
 * All endpoints are accessed through the API Gateway.
 */
@Injectable({ providedIn: 'root' })
export class AnimalService {
  /**
   * Get all animals
   * 
   * @swagger GET /animal-microservice/animals/getAll
   * @returns Observable of Animal array
   * @throws HttpErrorResponse on API failure
   */
  getAllAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.baseUrl}/getAll`);
  }
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. CORS Errors

**Problem**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solutions**:
```typescript
// Option A: Use Angular proxy (development)
// Create proxy.conf.json and update angular.json

// Option B: Configure backend CORS
// Add CORS configuration to Spring Boot Gateway

// Option C: Use browser extension (not recommended for production)
```

#### 2. Cannot Connect to Swagger UI

**Problem**: 404 error when accessing Swagger UI

**Check**:
```bash
# 1. Verify services are running
curl http://localhost:8765/actuator/health

# 2. Check Swagger dependency in backend pom.xml
# springdoc-openapi-starter-webmvc-ui should be present

# 3. Verify application.yml has springdoc configuration
# springdoc.swagger-ui.enabled: true
```

#### 3. Type Mismatches

**Problem**: Generated types don't match API responses

**Solution**:
```typescript
// Download latest OpenAPI spec
curl http://localhost:8765/v3/api-docs > api-spec.json

// Regenerate client
npm run generate:api

// Clear Angular cache
rm -rf .angular/cache
ng build
```

#### 4. Authentication Issues

**Problem**: 401 Unauthorized errors

**Solution**:
```typescript
// Check JWT token is included in request
// Verify token hasn't expired
// Check backend security configuration

// Debug with interceptor
export const debugInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Request Headers:', req.headers.get('Authorization'));
  return next(req);
};
```

#### 5. API Gateway Routing Issues

**Problem**: 404 errors for microservice endpoints

**Check**:
```bash
# 1. Verify Eureka registration
curl http://localhost:8761/eureka/apps

# 2. Check Gateway routes
curl http://localhost:8765/actuator/gateway/routes

# 3. Test direct service access
curl http://localhost:8081/animals/getAll
```

#### 6. Large Response Payloads

**Problem**: Slow API responses

**Solution**:
```typescript
// Implement pagination
interface PageRequest {
  page: number;
  size: number;
}

getAllAnimals(pageRequest: PageRequest): Observable<PageResponse<Animal>> {
  const params = new HttpParams()
    .set('page', pageRequest.page.toString())
    .set('size', pageRequest.size.toString());
    
  return this.http.get<PageResponse<Animal>>(`${this.baseUrl}/getAll`, { params });
}
```

---

## Additional Resources

### Documentation Links
- **Swagger UI**: http://localhost:8765/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8765/v3/api-docs
- **Eureka Dashboard**: http://localhost:8761
- **Angular Docs**: https://angular.io/docs
- **RxJS Docs**: https://rxjs.dev/
- **OpenAPI Generator**: https://openapi-generator.tech/

### Useful Tools
- **Postman**: API testing and collection management
- **Swagger Editor**: https://editor.swagger.io/
- **JSON Formatter**: Chrome extension for viewing API responses
- **Angular DevTools**: Chrome extension for debugging Angular apps

### Code Examples Repository
All examples from this guide are available in the project:
- Services: `src/app/core/services/`
- Models: `src/app/core/models/`
- Interceptors: `src/app/core/interceptors/`

---

## Quick Reference Card

### Essential URLs
```
API Gateway:     http://localhost:8765
Swagger UI:      http://localhost:8765/swagger-ui.html
OpenAPI Spec:    http://localhost:8765/v3/api-docs
Eureka:          http://localhost:8761
Angular App:     http://localhost:4200
```

### Key Commands
```bash
# Start backend services
java -jar gateway.jar

# Start Angular app
npm start

# Generate API client
npm run generate:api

# Build for production
npm run build:prod

# Run tests
npm test
```

### HTTP Status Codes
```
200 OK          - Request successful
201 Created     - Resource created
400 Bad Request - Invalid request
401 Unauthorized - Authentication required
403 Forbidden   - Insufficient permissions
404 Not Found   - Resource not found
500 Server Error - Backend error
```

---

**Last Updated**: 2025-10-09  
**Version**: 1.0.0  
**Maintainer**: Pet Haven Portal Team

For questions or issues, please refer to the main `README.md` or create an issue in the repository.

