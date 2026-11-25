
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3001/api/users';

  constructor(private http: HttpClient) {}

  // Get authorization headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Get all users (Admin)
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Add a new user (Admin)
  addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user, {
      headers: this.getHeaders()
    });
  }

  // Delete a user (Admin)
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Update a user (Admin)
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user, {
      headers: this.getHeaders()
    });
  }

}
