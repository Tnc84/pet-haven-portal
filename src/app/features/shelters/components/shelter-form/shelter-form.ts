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
import { ShelterService } from '../../../../core/services/shelter.service';

@Component({
  selector: 'app-shelter-form',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './shelter-form.html',
  styleUrl: './shelter-form.scss'
})
export class ShelterForm implements OnInit {
  shelterForm: FormGroup;
  isEditMode = false;
  shelterId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private shelterService: ShelterService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.shelterForm = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      environment: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.shelterId = +id;
      // Load shelter data would go here
    }
  }

  onSubmit(): void {
    if (this.shelterForm.valid) {
      const shelterData = this.shelterForm.value;
      
      if (this.isEditMode && this.shelterId) {
        shelterData.id = this.shelterId;
        this.shelterService.updateShelter(shelterData).subscribe({
          next: () => {
            this.snackBar.open('Shelter updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/shelters']);
          }
        });
      } else {
        this.shelterService.createShelter(shelterData).subscribe({
          next: () => {
            this.snackBar.open('Shelter created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/shelters']);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/shelters']);
  }
}
