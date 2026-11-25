

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Equipment as EquipmentModel } from '../models/equipment';

@Injectable({
  providedIn: 'root'
})
export class Equipment {
  private apiUrl = 'http://127.0.0.1:3000/api/equipment';

  constructor(private http: HttpClient) {}

  // Get all equipment
  getAll() {
    return this.http.get<EquipmentModel[]>(this.apiUrl);
  }

  // Add new equipment
  create(data: FormData) {
    return this.http.post<EquipmentModel>(this.apiUrl, data);
  }

  // Update equipment
  update(id: number, data: FormData) {
    return this.http.put<EquipmentModel>(`${this.apiUrl}/${id}`, data);
  }

  // Delete equipment
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // Get categories and statuses
getFilters() {
  return this.http.get<{
    categories: string[];
    statuses: string[];
  }>(`${this.apiUrl}/filters`);
}
}
