
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Equipment } from './services/equipment';
import { Equipment as EquipmentModel } from './models/equipment';

@Component({
  imports: [RouterOutlet, FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {

  equipments: EquipmentModel[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  showAddForm = false;
  editingEquipmentId: number | null = null;
  selectedFile: File | null = null;

  newEquipment = {
    name: '',
    description: '',
    category: '',
    status: 'available' as 'available' | 'reserved' | 'maintenance'
  };

  constructor(
    private equipmentService: Equipment,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEquipments();
  }

  // Load all equipment
  loadEquipments(): void {
    this.isLoading = true;

    this.equipmentService.getAll().subscribe({
      next: (data) => {
        this.equipments = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Unable to load equipment.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Select image
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Open edit form
  startEdit(item: EquipmentModel): void {
    this.editingEquipmentId = item.id;

    this.newEquipment = {
      name: item.name,
      description: item.description || '',
      category: item.category || '',
      status: item.status
    };

    this.selectedFile = null;
    this.successMessage = '';
    this.errorMessage = '';
    this.showAddForm = true;
  }

  // Cancel form
  cancelForm(): void {
    this.showAddForm = false;
    this.editingEquipmentId = null;
    this.selectedFile = null;

    this.newEquipment = {
      name: '',
      description: '',
      category: '',
      status: 'available'
    };
  }

  // Add or update equipment
  saveEquipment(): void {
    const formData = new FormData();

    formData.append('name', this.newEquipment.name);
    formData.append('description', this.newEquipment.description);
    formData.append('category', this.newEquipment.category);
    formData.append('status', this.newEquipment.status);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const isEditing = this.editingEquipmentId !== null;

    const request = isEditing
      ? this.equipmentService.update(this.editingEquipmentId!, formData)
      : this.equipmentService.create(formData);

    request.subscribe({
      next: () => {
        this.successMessage = isEditing
          ? 'Equipment updated successfully!'
          : 'Equipment added successfully!';

        this.errorMessage = '';

        this.cancelForm();
        this.loadEquipments();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Save error:', error);
        this.errorMessage =
          error.error?.message || 'Unable to save equipment.';
        this.cdr.markForCheck();
      }
    });
  }

  // Delete equipment
  deleteEquipment(id: number): void {
    if (!confirm('Are you sure you want to delete this equipment?')) {
      return;
    }

    this.equipmentService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Equipment deleted successfully!';
        this.errorMessage = '';

        this.loadEquipments();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Delete error:', error);
        this.errorMessage = 'Unable to delete equipment.';
        this.cdr.markForCheck();
      }
    });
  }
}
