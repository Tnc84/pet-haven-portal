import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AnimalService } from '../../../../core/services/animal.service';
import { Animal } from '../../../../core/models/animal.model';

@Component({
  selector: 'app-animal-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule
  ],
  templateUrl: './animal-list.html',
  styleUrl: './animal-list.scss'
})
export class AnimalList implements OnInit {
  animals: Animal[] = [];
  displayedColumns: string[] = ['id', 'name', 'breed', 'species', 'environment', 'actions'];

  constructor(
    private animalService: AnimalService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    console.log('Loading animals...');
    this.animalService.getAllAnimals().subscribe({
      next: (animals) => {
        console.log('Animals loaded successfully:', animals);
        this.animals = animals;
        this.snackBar.open('Animals loaded successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        console.error('Error loading animals:', error);
        this.snackBar.open('Failed to load animals. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  viewAnimal(id: number | null): void {
    if (id) {
      this.router.navigate(['/animals', id]);
    }
  }

  editAnimal(id: number | null): void {
    if (id) {
      this.router.navigate(['/animals', 'edit', id]);
    }
  }

  createAnimal(): void {
    this.router.navigate(['/animals', 'new']);
  }
}
