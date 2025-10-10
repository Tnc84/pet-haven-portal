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

  /**
   * GET /animals/getAll
   * @returns Observable<Animal[]> - All animals (requires authentication)
   */
  getAllAnimals(): Observable<Animal[]> {
    return this.apiService.getAuthenticated<Animal[]>(`${this.endpoint}/getAll`);
  }

  /**
   * GET /animals/getById/{id}
   * @param id Animal ID
   * @returns Observable<Animal> - Animal details (requires authentication)
   */
  getAnimalById(id: number): Observable<Animal> {
    return this.apiService.getAuthenticated<Animal>(`${this.endpoint}/getById/${id}`);
  }

  /**
   * POST /animals
   * @param animal Animal data (without ID)
   * @returns Observable<Animal> - Created animal (requires authentication)
   */
  createAnimal(animal: AnimalCreateRequest): Observable<Animal> {
    return this.apiService.postAuthenticated<Animal>(this.endpoint, animal);
  }

  /**
   * PUT /animals
   * @param animal Animal data (with ID)
   * @returns Observable<Animal> - Updated animal (requires authentication)
   */
  updateAnimal(animal: AnimalUpdateRequest): Observable<Animal> {
    return this.apiService.putAuthenticated<Animal>(this.endpoint, animal);
  }

  /**
   * DELETE /animals/{id}
   * @param id Animal ID
   * @returns Observable<any> - Deletion result (requires authentication)
   */
  deleteAnimal(id: number): Observable<any> {
    return this.apiService.deleteAuthenticated<any>(`${this.endpoint}/${id}`);
  }
}

