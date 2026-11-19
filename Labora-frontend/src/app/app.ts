import { Component } from '@angular/core';
import { BookingCheckout } from './booking-checkout/booking-checkout';
import { MyReservations } from './my-reservations/my-reservations';

@Component({
  selector: 'app-root',
  imports: [BookingCheckout, MyReservations],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}