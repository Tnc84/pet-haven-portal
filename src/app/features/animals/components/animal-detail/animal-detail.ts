import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AnimalService } from '../../../../core/services/animal.service';
import { Animal } from '../../../../core/models/animal.model';

@Component({
  selector: 'app-animal-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './animal-detail.html',
  styleUrl: './animal-detail.scss'
})
export class AnimalDetail implements OnInit {
  animal: Animal | null = null;
  loading = true;

  constructor(
    private animalService: AnimalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAnimal(+id);
    }
  }

  loadAnimal(id: number): void {
    this.animalService.getAnimalById(id).subscribe({
      next: (animal) => {
        this.animal = animal;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading animal:', error);
        this.loading = false;
      }
    });
  }

  editAnimal(): void {
    if (this.animal?.id) {
      this.router.navigate(['/animals', 'edit', this.animal.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/animals']);
  }
}
