# Angular Frontend Implementation Guide for Animal Shelter Microservices

## Executive Summary

Build a **single Angular application** that communicates with all backend microservices through the API Gateway (port 8765). This approach provides a unified user experience while maintaining clean separation of concerns through feature modules.

---

## 1. Project Setup & Architecture

### 1.1 Initialize Angular Project

```bash
# Create new Angular project with routing and SCSS
ng new animal-shelter-frontend --routing --style=scss

cd animal-shelter-frontend

# Add Angular Material for UI components
ng add @angular/material

# Install additional dependencies
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools
npm install rxjs
npm install jwt-decode
```

### 1.2 Recommended Project Structure

```
src/app/
├── core/                          # Singleton services, guards, interceptors
│   ├── services/
│   │   ├── api.service.ts         # Base HTTP service
│   │   ├── auth.service.ts        # Authentication logic
│   │   ├── animal.service.ts      # Animal API calls
│   │   ├── shelter.service.ts     # Shelter API calls
│   │   └── user.service.ts        # User API calls
│   ├── guards/
│   │   ├── auth.guard.ts          # Route protection
│   │   └── role.guard.ts          # Role-based access
│   ├── interceptors/
│   │   ├── auth.interceptor.ts    # Add JWT token to requests
│   │   ├── error.interceptor.ts   # Global error handling
│   │   └── loading.interceptor.ts # Loading state management
│   ├── models/
│   │   ├── animal.model.ts
│   │   ├── shelter.model.ts
│   │   └── user.model.ts
│   └── core.module.ts
├── features/                      # Feature modules (lazy-loaded)
│   ├── animals/
│   │   ├── components/
│   │   │   ├── animal-list/
│   │   │   ├── animal-detail/
│   │   │   └── animal-form/
│   │   ├── animals-routing.module.ts
│   │   └── animals.module.ts
│   ├── shelters/
│   │   ├── components/
│   │   │   ├── shelter-list/
│   │   │   ├── shelter-detail/
│   │   │   └── shelter-form/
│   │   ├── shelters-routing.module.ts
│   │   └── shelters.module.ts
│   ├── users/
│   │   ├── components/
│   │   │   ├── user-list/
│   │   │   ├── user-detail/
│   │   │   └── user-form/
│   │   ├── users-routing.module.ts
│   │   └── users.module.ts
│   └── auth/
│       ├── components/
│       │   ├── login/
│       │   └── register/
│       ├── auth-routing.module.ts
│       └── auth.module.ts
├── shared/                        # Shared components, pipes, directives
│   ├── components/
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── loading-spinner/
│   │   └── confirm-dialog/
│   ├── pipes/
│   └── shared.module.ts
├── layout/                        # Layout components
│   ├── main-layout/
│   └── auth-layout/
└── app-routing.module.ts
```

---

## 2. API Integration Configuration

### 2.1 Environment Configuration

Create `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8765',  // API Gateway URL
  endpoints: {
    animals: '/animal-microservice/animals',
    shelters: '/shelter-microservice/shelters',
    users: '/user-microservice/users'
  }
};
```

Create `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-domain.com',  // Production API Gateway
  endpoints: {
    animals: '/animal-microservice/animals',
    shelters: '/shelter-microservice/shelters',
    users: '/user-microservice/users'
  }
};
```

### 2.2 Data Models

Create `src/app/core/models/animal.model.ts`:

```typescript
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
```

Create `src/app/core/models/shelter.model.ts`:

```typescript
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
```

Create `src/app/core/models/user.model.ts`:

```typescript
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
  role: string;
  authorities: string[];
  isActive: boolean;
  isNotLocked: boolean;
}

export interface UserCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isNotLocked: boolean;
}

export interface UserUpdateRequest extends UserCreateRequest {
  id: number;
}

export interface HttpResponse {
  httpStatusCode: number;
  httpStatus: string;
  reason: string;
  message: string;
}
```

---

## 3. Core Services Implementation

### 3.1 Base API Service

Create `src/app/core/services/api.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
```

### 3.2 Animal Service

Create `src/app/core/services/animal.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Animal, AnimalCreateRequest, AnimalUpdateRequest } from '../models/animal.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private endpoint = environment.endpoints.animals;

  constructor(private apiService: ApiService) {}

  // GET /animals/getAll
  getAllAnimals(): Observable<Animal[]> {
    return this.apiService.get<Animal[]>(`${this.endpoint}/getAll`);
  }

  // GET /animals/getById/{id}
  getAnimalById(id: number): Observable<Animal> {
    return this.apiService.get<Animal>(`${this.endpoint}/getById/${id}`);
  }

  // POST /animals
  createAnimal(animal: AnimalCreateRequest): Observable<Animal> {
    return this.apiService.post<Animal>(this.endpoint, animal);
  }

  // PUT /animals
  updateAnimal(animal: AnimalUpdateRequest): Observable<Animal> {
    return this.apiService.put<Animal>(this.endpoint, animal);
  }
}
```

### 3.3 Shelter Service

Create `src/app/core/services/shelter.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Shelter, ShelterCreateRequest, ShelterUpdateRequest } from '../models/shelter.model';
import { Animal } from '../models/animal.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShelterService {
  private endpoint = environment.endpoints.shelters;

  constructor(private apiService: ApiService) {}

  // GET /shelters/getAll
  getAllShelters(): Observable<Shelter[]> {
    return this.apiService.get<Shelter[]>(`${this.endpoint}/getAll`);
  }

  // GET /shelters/getAllAnimals (via Feign - gets animals from animal microservice)
  getAllAnimalsViaFeign(): Observable<Animal[]> {
    return this.apiService.get<Animal[]>(`${this.endpoint}/getAllAnimals`);
  }

  // POST /shelters/add
  createShelter(shelter: ShelterCreateRequest): Observable<Shelter> {
    return this.apiService.post<Shelter>(`${this.endpoint}/add`, shelter);
  }

  // PUT /shelters/update
  updateShelter(shelter: ShelterUpdateRequest): Observable<Shelter> {
    return this.apiService.put<Shelter>(`${this.endpoint}/update`, shelter);
  }
}
```

### 3.4 User Service

Create `src/app/core/services/user.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, UserCreateRequest, UserUpdateRequest, HttpResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = environment.endpoints.users;

  constructor(private apiService: ApiService) {}

  // GET /users
  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(this.endpoint);
  }

  // GET /users/find/{username}
  getUserByEmail(email: string): Observable<User> {
    return this.apiService.get<User>(`${this.endpoint}/find/${email}`);
  }

  // POST /users/add
  createUser(user: UserCreateRequest): Observable<User> {
    return this.apiService.post<User>(`${this.endpoint}/add`, user);
  }

  // PUT /users/update
  updateUser(user: UserUpdateRequest): Observable<User> {
    return this.apiService.put<User>(`${this.endpoint}/update`, user);
  }

  // DELETE /users/delete/{id}
  deleteUser(id: number): Observable<HttpResponse> {
    return this.apiService.delete<HttpResponse>(`${this.endpoint}/delete/${id}`);
  }

  // GET /users/resetPassword/{email}
  resetPassword(email: string): Observable<HttpResponse> {
    return this.apiService.get<HttpResponse>(`${this.endpoint}/resetPassword/${email}`);
  }
}
```

### 3.5 Authentication Service (Future JWT Implementation)

Create `src/app/core/services/auth.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // TODO: Implement when backend JWT authentication is ready
  login(email: string, password: string): Observable<any> {
    // This will be implemented when backend provides login endpoint
    throw new Error('Login endpoint not yet implemented in backend');
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user && user.role === role;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
```

---

## 4. HTTP Interceptors

### 4.1 Authentication Interceptor

Create `src/app/core/interceptors/auth.interceptor.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          'Jwt-Token': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request);
  }
}
```

### 4.2 Error Interceptor

Create `src/app/core/interceptors/error.interceptor.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 401:
              errorMessage = 'Unauthorized. Please login again.';
              this.authService.logout();
              break;
            case 403:
              errorMessage = 'You do not have permission to access this resource.';
              break;
            case 404:
              errorMessage = 'Resource not found.';
              break;
            case 500:
              errorMessage = 'Internal server error. Please try again later.';
              break;
            default:
              errorMessage = error.error?.message || `Error Code: ${error.status}`;
          }
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });

        return throwError(() => error);
      })
    );
  }
}
```

### 4.3 Loading Interceptor

Create `src/app/core/interceptors/loading.interceptor.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.activeRequests === 0) {
      this.loadingService.show();
    }
    this.activeRequests++;

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.loadingService.hide();
        }
      })
    );
  }
}
```

Create `src/app/core/services/loading.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingSubject.next(false);
  }
}
```

---

## 5. Route Guards

### 5.1 Auth Guard

Create `src/app/core/guards/auth.guard.ts`:

```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Not logged in, redirect to login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
```

### 5.2 Role Guard

Create `src/app/core/guards/role.guard.ts`:

```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    const user = this.authService.currentUserValue;

    if (user && expectedRoles.includes(user.role)) {
      return true;
    }

    // Not authorized, redirect to home
    this.router.navigate(['/']);
    return false;
  }
}
```

---

## 6. App Module Configuration

Update `src/app/app.module.ts`:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

---

## 7. Routing Configuration

Update `src/app/app-routing.module.ts`:

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/animals', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'animals',
    loadChildren: () => import('./features/animals/animals.module').then(m => m.AnimalsModule),
    // canActivate: [AuthGuard]  // Uncomment when authentication is implemented
  },
  {
    path: 'shelters',
    loadChildren: () => import('./features/shelters/shelters.module').then(m => m.SheltersModule),
    // canActivate: [AuthGuard]  // Uncomment when authentication is implemented
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
    // canActivate: [AuthGuard, RoleGuard],  // Uncomment when authentication is implemented
    // data: { roles: ['ADMIN', 'MANAGER', 'OWNER'] }
  },
  { path: '**', redirectTo: '/animals' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

---

## 8. Example Feature Module Implementation

### 8.1 Animals Module Structure

Generate components:

```bash
ng generate module features/animals --routing
ng generate component features/animals/components/animal-list
ng generate component features/animals/components/animal-detail
ng generate component features/animals/components/animal-form
```

### 8.2 Animal List Component

`src/app/features/animals/components/animal-list/animal-list.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from '../../../../core/services/animal.service';
import { Animal } from '../../../../core/models/animal.model';

@Component({
  selector: 'app-animal-list',
  templateUrl: './animal-list.component.html',
  styleUrls: ['./animal-list.component.scss']
})
export class AnimalListComponent implements OnInit {
  animals: Animal[] = [];
  displayedColumns: string[] = ['id', 'name', 'breed', 'species', 'environment', 'actions'];

  constructor(
    private animalService: AnimalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.animalService.getAllAnimals().subscribe({
      next: (animals) => {
        this.animals = animals;
      },
      error: (error) => {
        console.error('Error loading animals:', error);
      }
    });
  }

  viewAnimal(id: number): void {
    this.router.navigate(['/animals', id]);
  }

  editAnimal(id: number): void {
    this.router.navigate(['/animals', 'edit', id]);
  }

  createAnimal(): void {
    this.router.navigate(['/animals', 'new']);
  }
}
```

`src/app/features/animals/components/animal-list/animal-list.component.html`:

```html
<div class="animal-list-container">
  <div class="header">
    <h1>Animals</h1>
    <button mat-raised-button color="primary" (click)="createAnimal()">
      <mat-icon>add</mat-icon>
      Add Animal
    </button>
  </div>

  <mat-card>
    <table mat-table [dataSource]="animals" class="mat-elevation-z8">
      
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let animal">{{animal.id}}</td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let animal">{{animal.name}}</td>
      </ng-container>

      <ng-container matColumnDef="breed">
        <th mat-header-cell *matHeaderCellDef>Breed</th>
        <td mat-cell *matCellDef="let animal">{{animal.breed}}</td>
      </ng-container>

      <ng-container matColumnDef="species">
        <th mat-header-cell *matHeaderCellDef>Species</th>
        <td mat-cell *matCellDef="let animal">{{animal.species}}</td>
      </ng-container>

      <ng-container matColumnDef="environment">
        <th mat-header-cell *matHeaderCellDef>Environment</th>
        <td mat-cell *matCellDef="let animal">{{animal.environment}}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let animal">
          <button mat-icon-button color="primary" (click)="viewAnimal(animal.id)">
            <mat-icon>visibility</mat-icon>
          </button>
          <button mat-icon-button color="accent" (click)="editAnimal(animal.id)">
            <mat-icon>edit</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </mat-card>
</div>
```

### 8.3 Animal Form Component

`src/app/features/animals/components/animal-form/animal-form.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalService } from '../../../../core/services/animal.service';
import { Animal } from '../../../../core/models/animal.model';

@Component({
  selector: 'app-animal-form',
  templateUrl: './animal-form.component.html',
  styleUrls: ['./animal-form.component.scss']
})
export class AnimalFormComponent implements OnInit {
  animalForm: FormGroup;
  isEditMode = false;
  animalId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private animalService: AnimalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.animalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      breed: ['', Validators.required],
      species: ['', Validators.required],
      photo: [''],
      environment: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.animalId = +id;
      this.loadAnimal(this.animalId);
    }
  }

  loadAnimal(id: number): void {
    this.animalService.getAnimalById(id).subscribe({
      next: (animal) => {
        this.animalForm.patchValue(animal);
      },
      error: (error) => {
        console.error('Error loading animal:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.animalForm.valid) {
      const animalData = this.animalForm.value;

      if (this.isEditMode && this.animalId) {
        animalData.id = this.animalId;
        this.animalService.updateAnimal(animalData).subscribe({
          next: () => {
            this.router.navigate(['/animals']);
          },
          error: (error) => {
            console.error('Error updating animal:', error);
          }
        });
      } else {
        this.animalService.createAnimal(animalData).subscribe({
          next: () => {
            this.router.navigate(['/animals']);
          },
          error: (error) => {
            console.error('Error creating animal:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/animals']);
  }
}
```

---

## 9. Testing Strategy

### 9.1 Unit Testing Example

`src/app/core/services/animal.service.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnimalService } from './animal.service';
import { Animal } from '../models/animal.model';
import { environment } from '../../../environments/environment';

describe('AnimalService', () => {
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

  it('should retrieve all animals', () => {
    const mockAnimals: Animal[] = [
      { id: 1, name: 'Max', breed: 'Golden Retriever', species: 'Dog', photo: '', environment: 'test' },
      { id: 2, name: 'Whiskers', breed: 'Persian', species: 'Cat', photo: '', environment: 'test' }
    ];

    service.getAllAnimals().subscribe(animals => {
      expect(animals.length).toBe(2);
      expect(animals).toEqual(mockAnimals);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}${environment.endpoints.animals}/getAll`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnimals);
  });

  it('should create an animal', () => {
    const newAnimal = {
      name: 'Buddy',
      breed: 'Labrador',
      species: 'Dog',
      photo: '',
      environment: 'test'
    };

    const createdAnimal: Animal = { id: 3, ...newAnimal };

    service.createAnimal(newAnimal).subscribe(animal => {
      expect(animal).toEqual(createdAnimal);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}${environment.endpoints.animals}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAnimal);
    req.flush(createdAnimal);
  });
});
```

---

## 10. Deployment & Build

### 10.1 Development Server

```bash
# Start development server
ng serve

# Access at http://localhost:4200
```

### 10.2 Production Build

```bash
# Build for production
ng build --configuration production

# Output will be in dist/animal-shelter-frontend/
```

### 10.3 Docker Configuration (Optional)

Create `Dockerfile`:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist/animal-shelter-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://api-gateway:8765/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 11. API Endpoints Reference

### Animal Microservice (via Gateway)
- **Base URL**: `http://localhost:8765/animal-microservice/animals`
- `GET /getAll` - Get all animals
- `GET /getById/{id}` - Get animal by ID
- `POST /` - Create new animal (no ID in body)
- `PUT /` - Update animal (ID required in body)

### Shelter Microservice (via Gateway)
- **Base URL**: `http://localhost:8765/shelter-microservice/shelters`
- `GET /getAll` - Get all shelters
- `GET /getAllAnimals` - Get all animals via Feign
- `POST /add` - Create new shelter (no ID in body)
- `PUT /update` - Update shelter (ID required in body)

### User Microservice (via Gateway)
- **Base URL**: `http://localhost:8765/user-microservice/users`
- `GET /` - Get all users
- `GET /find/{email}` - Find user by email
- `POST /add` - Create new user (no ID in body)
- `PUT /update` - Update user (ID required in body)
- `DELETE /delete/{id}` - Delete user
- `GET /resetPassword/{email}` - Reset user password

---

## 12. Important Notes

### Security Considerations
1. **Authentication is currently disabled** in the backend (PUBLIC_URLS = "**")
2. JWT token handling is prepared but not active
3. When backend security is enabled:
   - Uncomment route guards in routing
   - Implement login/register components
   - Update AuthService with actual login endpoint

### CORS Configuration
Ensure backend API Gateway allows requests from Angular dev server:
- Development: `http://localhost:4200`
- Production: Your production domain

### Error Handling
- All HTTP errors are intercepted globally
- User-friendly messages displayed via Material Snackbar
- 401 errors automatically redirect to login

### Best Practices
1. Use reactive forms for all user inputs
2. Implement proper validation matching backend constraints
3. Use lazy loading for feature modules
4. Implement proper error handling in all components
5. Write unit tests for services and components
6. Use Angular Material for consistent UI

---

## 13. Next Steps After Basic Implementation

1. **Add pagination** for list views
2. **Implement search and filtering** functionality
3. **Add confirmation dialogs** for delete operations
4. **Implement file upload** for animal photos
5. **Add real-time updates** with WebSockets (if backend supports)
6. **Implement state management** with NgRx for complex state
7. **Add internationalization** (i18n) support
8. **Implement PWA features** for offline capability
9. **Add comprehensive error logging** and monitoring
10. **Implement accessibility features** (WCAG compliance)

---

## 14. Support & Resources

### Angular Documentation
- [Angular Official Docs](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)

### Backend API Gateway
- Development: `http://localhost:8765`
- Eureka Dashboard: `http://localhost:8761`

### Contact
For backend API questions or issues, coordinate with the backend team regarding:
- Authentication implementation timeline
- CORS configuration
- API contract changes
- Error response formats
