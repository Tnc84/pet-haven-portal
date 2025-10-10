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

  /**
   * GET /users
   * @returns Observable<User[]> - All users (requires authentication)
   */
  getAllUsers(): Observable<User[]> {
    return this.apiService.getAuthenticated<User[]>(this.endpoint);
  }

  /**
   * GET /users/find/{email}
   * @param email User email
   * @returns Observable<User> - User details (requires authentication)
   */
  getUserByEmail(email: string): Observable<User> {
    return this.apiService.getAuthenticated<User>(`${this.endpoint}/find/${email}`);
  }

  /**
   * POST /users/add
   * @param user User data (without ID)
   * @returns Observable<User> - Created user (requires authentication)
   */
  createUser(user: UserCreateRequest): Observable<User> {
    return this.apiService.postAuthenticated<User>(`${this.endpoint}/add`, user);
  }

  /**
   * PUT /users/update
   * @param user User data (with ID)
   * @returns Observable<User> - Updated user (requires authentication)
   */
  updateUser(user: UserUpdateRequest): Observable<User> {
    return this.apiService.putAuthenticated<User>(`${this.endpoint}/update`, user);
  }

  /**
   * DELETE /users/delete/{id}
   * @param id User ID
   * @returns Observable<HttpResponse> - Deletion result (requires authentication)
   */
  deleteUser(id: number): Observable<HttpResponse> {
    return this.apiService.deleteAuthenticated<HttpResponse>(`${this.endpoint}/delete/${id}`);
  }

  /**
   * GET /users/resetPassword/{email}
   * @param email User email
   * @returns Observable<HttpResponse> - Password reset result (requires authentication)
   */
  resetPassword(email: string): Observable<HttpResponse> {
    return this.apiService.getAuthenticated<HttpResponse>(`${this.endpoint}/resetPassword/${email}`);
  }
}

