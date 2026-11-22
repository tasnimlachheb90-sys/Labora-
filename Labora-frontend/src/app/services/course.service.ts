import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://localhost:3001/api/courses';

  constructor(private http: HttpClient) {}

  // Récupérer tous les cours
  getCourses(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(this.apiUrl, { headers });
  }

  // Ajouter un cours
  addCourse(course: any): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, course, { headers });
  }

  // Modifier un cours
  updateCourse(id: number, course: any): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/${id}`, course, { headers });
  }

  // Supprimer un cours
  deleteCourse(id: number): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}