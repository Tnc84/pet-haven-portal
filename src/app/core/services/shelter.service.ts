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

  /**
   * GET /shelters/getAll
   * @returns Observable<Shelter[]> - All shelters (requires authentication)
   */
  getAllShelters(): Observable<Shelter[]> {
    return this.apiService.getAuthenticated<Shelter[]>(`${this.endpoint}/getAll`);
  }

  /**
   * GET /shelters/getAllAnimals (via Feign - gets animals from animal microservice)
   * @returns Observable<Animal[]> - All animals via shelter service (requires authentication)
   */
  getAllAnimalsViaFeign(): Observable<Animal[]> {
    return this.apiService.getAuthenticated<Animal[]>(`${this.endpoint}/getAllAnimals`);
  }

  /**
   * POST /shelters/add
   * @param shelter Shelter data (without ID)
   * @returns Observable<Shelter> - Created shelter (requires authentication)
   */
  createShelter(shelter: ShelterCreateRequest): Observable<Shelter> {
    return this.apiService.postAuthenticated<Shelter>(`${this.endpoint}/add`, shelter);
  }

  /**
   * PUT /shelters/update
   * @param shelter Shelter data (with ID)
   * @returns Observable<Shelter> - Updated shelter (requires authentication)
   */
  updateShelter(shelter: ShelterUpdateRequest): Observable<Shelter> {
    return this.apiService.putAuthenticated<Shelter>(`${this.endpoint}/update`, shelter);
  }

  /**
   * DELETE /shelters/{id}
   * @param id Shelter ID
   * @returns Observable<any> - Deletion result (requires authentication)
   */
  deleteShelter(id: number): Observable<any> {
    return this.apiService.deleteAuthenticated<any>(`${this.endpoint}/${id}`);
  }
}

