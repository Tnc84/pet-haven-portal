import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../../core/services/animal.service';
import { Animal } from '../../core/models/animal.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-happy-tails',
  imports: [CommonModule],
  templateUrl: './happy-tails.html',
  styleUrl: './happy-tails.scss'
})
export class HappyTails implements OnInit {
  animals: Animal[] = [];
  loading = true;
  error: string | null = null;

  constructor(private animalService: AnimalService) {}

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.loading = true;
    this.error = null;
    
    this.animalService.getAllAnimals().subscribe({
      next: (animals: Animal[]) => {
        this.animals = animals;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load animals';
        this.loading = false;
        console.error('Error loading animals:', error);
      }
    });
  }

  getRandomAnimalImage(animal: Animal): string {
    // Generate a consistent random image based on animal ID
    const imageIndex = (animal.id || 0) % 10;
    return `assets/images/animals/animal-${imageIndex + 1}.svg`;
  }

  getAnimalTypeIcon(species: string): string {
    switch (species?.toLowerCase()) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      case 'bird': return '🐦';
      case 'rabbit': return '🐰';
      case 'hamster': return '🐹';
      case 'fish': return '🐠';
      default: return '🐾';
    }
  }

  trackByAnimalId(index: number, animal: Animal): number | null {
    return animal.id;
  }
}
