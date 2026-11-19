import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService, BookedRange } from '../services/reservation.service';

@Component({
  selector: 'app-booking-checkout',
  imports: [FormsModule],
  templateUrl: './booking-checkout.html',
  styleUrl: './booking-checkout.css',
})
export class BookingCheckout implements OnInit {
  userId = 1;          // fixed until login exists (Student 1)
  equipmentId = 1;     // fixed until equipment exists (Student 2)
  startDate = '';
  endDate = '';
  purpose = '';
  today = new Date().toISOString().slice(0, 10);

  booked = signal<BookedRange[]>([]);
  message = signal('');
  isError = signal(false);

  constructor(private reservationService: ReservationService) {}

  ngOnInit() {
    this.loadBooked();
  }

  loadBooked() {
    this.reservationService.getBooked(this.equipmentId).subscribe({
      next: (ranges) => this.booked.set(ranges),
      error: () => this.booked.set([]),
    });
  }

  submit() {
    this.message.set('');
    this.reservationService
      .create({
        userId: this.userId,
        equipmentId: this.equipmentId,
        startDate: this.startDate,
        endDate: this.endDate,
        purpose: this.purpose,
      })
      .subscribe({
        next: () => {
          this.isError.set(false);
          this.message.set('Reservation confirmed!');
          this.loadBooked();
        },
        error: (err) => {
          this.isError.set(true);
          this.message.set(err.error?.message ?? 'Cannot reach the server');
        },
      });
  }
}