import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService, ReservationModel } from '../services/reservation.service';

@Component({
  selector: 'app-my-reservations',
  imports: [FormsModule],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.css',
})
export class MyReservations implements OnInit {
  userId = 1; // fixed until login exists (Student 1)
  reservations = signal<ReservationModel[]>([]);
  message = signal('');
  isError = signal(false);

  editingId: number | null = null;
  editStart = '';
  editEnd = '';

  constructor(private reservationService: ReservationService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.reservationService.getMine(this.userId, 'active').subscribe({
      next: (list) => this.reservations.set(list),
      error: () => this.show('Cannot load reservations', true),
    });
  }

  startEdit(r: ReservationModel) {
    this.editingId = r.id;
    this.editStart = r.startDate;
    this.editEnd = r.endDate;
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveEdit(id: number) {
    this.reservationService
      .update(id, { startDate: this.editStart, endDate: this.editEnd })
      .subscribe({
        next: () => {
          this.editingId = null;
          this.show('Reservation updated', false);
          this.load();
        },
        error: (err) => this.show(err.error?.message ?? 'Update failed', true),
      });
  }

  cancel(id: number) {
    if (!confirm('Cancel this reservation?')) return;
    this.reservationService.cancel(id).subscribe({
      next: () => {
        this.show('Reservation cancelled', false);
        this.load();
      },
      error: (err) => this.show(err.error?.message ?? 'Cancel failed', true),
    });
  }

  private show(text: string, error: boolean) {
    this.message.set(text);
    this.isError.set(error);
  }
}