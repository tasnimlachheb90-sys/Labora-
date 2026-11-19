
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ReservationService,
  ReservationModel
} from '../services/reservation.service';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.css',
})
export class MyReservations implements OnInit {

  userId = Number(
    JSON.parse(localStorage.getItem('user') || '{}').id
  );

  reservations = signal<ReservationModel[]>([]);
  message = signal('');
  isError = signal(false);

  editingId: number | null = null;
  editStart = '';
  editEnd = '';

  constructor(
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  // Charger les réservations de l'utilisateur connecté
  load(): void {
    console.log('USER ID:', this.userId);

    this.reservationService
      .getMine(this.userId, 'active')
      .subscribe({
        next: (list) => {
          console.log('RESERVATIONS RECEIVED:', list);

          this.reservations.set(list);

          console.log(
            'RESERVATIONS IN SIGNAL:',
            this.reservations()
          );
        },

        error: (err) => {
          console.error('RESERVATIONS ERROR:', err);
          this.show('Cannot load reservations', true);
        },
      });
  }

  // Modifier les dates
  startEdit(r: ReservationModel): void {
    this.editingId = r.id;
    this.editStart = r.startDate;
    this.editEnd = r.endDate;
  }

  // Annuler la modification
  cancelEdit(): void {
    this.editingId = null;
  }

  // Enregistrer les nouvelles dates
  saveEdit(id: number): void {
    this.reservationService
      .update(id, {
        startDate: this.editStart,
        endDate: this.editEnd
      })
      .subscribe({
        next: () => {
          this.editingId = null;
          this.show('Reservation updated', false);
          this.load();
        },

        error: (err) => {
          this.show(
            err.error?.message ?? 'Update failed',
            true
          );
        },
      });
  }

  // Annuler une réservation
  cancel(id: number): void {
    if (!confirm('Cancel this reservation?')) {
      return;
    }

    this.reservationService.cancel(id).subscribe({
      next: () => {
        this.show('Reservation cancelled', false);
        this.load();
      },

      error: (err) => {
        this.show(
          err.error?.message ?? 'Cancel failed',
          true
        );
      },
    });
  }

  // Afficher un message
  private show(text: string, error: boolean): void {
    this.message.set(text);
    this.isError.set(error);
  }
}
