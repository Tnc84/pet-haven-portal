import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AnimalService } from '../../../../core/services/animal.service';

@Component({
  selector: 'app-animal-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './animal-form.html',
  styleUrl: './animal-form.scss'
})
export class AnimalForm implements OnInit {
  animalForm: FormGroup;
  isEditMode = false;
  animalId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private animalService: AnimalService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
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
    this.loading = true;
    this.animalService.getAnimalById(id).subscribe({
      next: (animal) => {
        this.animalForm.patchValue(animal);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading animal:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.animalForm.valid) {
      this.loading = true;
      const animalData = this.animalForm.value;

      if (this.isEditMode && this.animalId) {
        animalData.id = this.animalId;
        this.animalService.updateAnimal(animalData).subscribe({
          next: () => {
            this.snackBar.open('Animal updated successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.router.navigate(['/animals']);
          },
          error: (error) => {
            console.error('Error updating animal:', error);
            this.loading = false;
          }
        });
      } else {
        this.animalService.createAnimal(animalData).subscribe({
          next: () => {
            this.snackBar.open('Animal created successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.router.navigate(['/animals']);
          },
          error: (error) => {
            console.error('Error creating animal:', error);
            this.loading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.animalForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/animals']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.animalForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
