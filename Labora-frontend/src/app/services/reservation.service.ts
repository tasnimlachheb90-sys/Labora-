import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservationModel {
  id: number;
  userId: number;
  equipmentId: number;
  startDate: string;
  endDate: string;
  purpose?: string;
  status: 'active' | 'cancelled';
}

export interface BookedRange {
  startDate: string;
  endDate: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = 'http://localhost:3001/api/reservations';

  constructor(private http: HttpClient) {}

  create(data: {
    userId: number;
    equipmentId: number;
    startDate: string;
    endDate: string;
    purpose?: string;
  }): Observable<ReservationModel> {
    return this.http.post<ReservationModel>(this.apiUrl, data);
  }

  getAll(): Observable<ReservationModel[]> {
    return this.http.get<ReservationModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<ReservationModel> {
    return this.http.get<ReservationModel>(`${this.apiUrl}/${id}`);
  }

  getMine(userId: number, status?: string): Observable<ReservationModel[]> {
    let params = new HttpParams().set('userId', userId);
    if (status) params = params.set('status', status);
    return this.http.get<ReservationModel[]>(`${this.apiUrl}/mine`, { params });
  }

  getBooked(equipmentId: number): Observable<BookedRange[]> {
    return this.http.get<BookedRange[]>(
      `${this.apiUrl}/equipment/${equipmentId}/booked`
    );
  }

  update(
    id: number,
    data: { startDate?: string; endDate?: string; purpose?: string }
  ): Observable<ReservationModel> {
    return this.http.put<ReservationModel>(`${this.apiUrl}/${id}`, data);
  }

  cancel(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(
      `${this.apiUrl}/${id}`
    );
  }
}