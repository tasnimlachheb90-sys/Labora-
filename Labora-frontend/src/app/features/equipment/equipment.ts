
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { Equipment as EquipmentService } from '../../services/equipment';
import { Equipment as EquipmentModel } from '../../models/equipment';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './equipment.html',
  styleUrl: './equipment.css',
})
export class Equipment implements OnInit {

  equipments: EquipmentModel[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Reactive Form
  equipmentForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    description: new FormControl('', {
      nonNullable: true
    }),

    category: new FormControl('', {
      nonNullable: true
    }),

    status: new FormControl<'available' | 'reserved' | 'maintenance'>(
      'available',
      { nonNullable: true }
    )
  });

  selectedImage: File | null = null;
  editingEquipmentId: number | null = null;

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.loadEquipments();
  }

  // READ: Load all equipment
  loadEquipments(): void {

    this.isLoading = true;

    this.equipmentService.getAll().subscribe({
      next: (data) => {
        this.equipments = data;
        this.isLoading = false;
      },

      error: (err) => {
        console.error('Error loading equipment:', err);
        this.errorMessage = 'Unable to load equipment.';
        this.isLoading = false;
      }
    });
  }

  // Select image
  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  // UPDATE: Select equipment for editing
  startEdit(item: EquipmentModel): void {

    this.editingEquipmentId = item.id;

    this.equipmentForm.patchValue({
      name: item.name,
      description: item.description || '',
      category: item.category || '',
      status: item.status
    });

    this.selectedImage = null;

    this.successMessage = '';
    this.errorMessage = '';
  }

  // Cancel editing
  cancelEdit(): void {

    this.editingEquipmentId = null;

    this.equipmentForm.reset({
      name: '',
      description: '',
      category: '',
      status: 'available'
    });

    this.selectedImage = null;

    this.errorMessage = '';
    this.successMessage = '';
  }

  // DELETE: Delete equipment
  deleteEquipment(id: number): void {

    const confirmDelete = confirm(
      'Are you sure you want to delete this equipment?'
    );

    if (confirmDelete) {

      this.equipmentService.delete(id).subscribe({

        next: () => {
          this.successMessage = 'Equipment deleted successfully!';
          this.errorMessage = '';

          this.loadEquipments();
        },

        error: (err) => {
          console.error('Error deleting equipment:', err);
          this.errorMessage = 'Error deleting equipment.';
          this.successMessage = '';
        }

      });
    }
  }

  // CREATE and UPDATE
  saveEquipment(): void {

    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAllAsTouched();
      this.errorMessage = 'Equipment name is required.';
      return;
    }

    const formValue = this.equipmentForm.getRawValue();

    if (!formValue.name.trim()) {
      this.errorMessage = 'Equipment name is required.';
      return;
    }

    const formData = new FormData();

    formData.append('name', formValue.name);
    formData.append('description', formValue.description);
    formData.append('category', formValue.category);
    formData.append('status', formValue.status);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    // UPDATE
    if (this.editingEquipmentId !== null) {

      this.equipmentService.update(
        this.editingEquipmentId,
        formData
      ).subscribe({

        next: () => {
          this.cancelEdit();
          this.successMessage = 'Equipment updated successfully!';
          this.errorMessage = '';

          this.loadEquipments();
        },

        error: (err) => {
          console.error('Error updating equipment:', err);
          this.errorMessage = 'Error updating equipment.';
          this.successMessage = '';
        }

      });

    } else {

      // CREATE
      this.equipmentService.create(formData).subscribe({

        next: () => {
          this.cancelEdit();
          this.successMessage = 'Equipment added successfully!';
          this.errorMessage = '';

          this.loadEquipments();
        },

        error: (err) => {
          console.error('Error adding equipment:', err);
          this.errorMessage = 'Error adding equipment.';
          this.successMessage = '';
        }

      });

    }
  }

}
