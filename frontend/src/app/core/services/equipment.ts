import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class Equipment {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/equipment';
    getFilters() {
        return this.http.get<{
        categories: string[];
        statuses: string[];
  }>(`${this.apiUrl}/filters`);
}
}
