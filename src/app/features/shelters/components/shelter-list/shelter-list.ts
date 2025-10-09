import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ShelterService } from '../../../../core/services/shelter.service';
import { Shelter } from '../../../../core/models/shelter.model';

@Component({
  selector: 'app-shelter-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatSnackBarModule],
  templateUrl: './shelter-list.html',
  styleUrl: './shelter-list.scss'
})
export class ShelterList implements OnInit {
  shelters: Shelter[] = [];
  displayedColumns: string[] = ['id', 'name', 'city', 'environment', 'actions'];

  constructor(
    private shelterService: ShelterService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadShelters();
  }

  loadShelters(): void {
    this.shelterService.getAllShelters().subscribe({
      next: (shelters) => {
        this.shelters = shelters;
        this.snackBar.open('Shelters loaded successfully', 'Close', { duration: 3000 });
      },
      error: (error) => console.error('Error loading shelters:', error)
    });
  }

  viewShelter(id: number | null): void {
    if (id) this.router.navigate(['/shelters', id]);
  }

  editShelter(id: number | null): void {
    if (id) this.router.navigate(['/shelters', 'edit', id]);
  }

  createShelter(): void {
    this.router.navigate(['/shelters', 'new']);
  }
}
