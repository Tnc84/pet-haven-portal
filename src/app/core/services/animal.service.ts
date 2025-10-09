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

