

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, {
      username,
      password
    });
  }

  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
}
