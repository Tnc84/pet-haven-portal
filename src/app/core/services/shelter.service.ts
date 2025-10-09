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

