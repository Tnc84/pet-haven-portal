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

