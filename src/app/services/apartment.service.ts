import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apartment } from '../interfaces/apartment';

@Injectable({
  providedIn: 'root',
})
export class ApartmentService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = 'https://rentmaster-api.onrender.com'; 
    this.myApiUrl = '/api/apartments'; 
  }

  getApartments(): Observable<Apartment[]> {
    const token = localStorage.getItem('token'); // Verifica que guardaste el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Enviando el token en el encabezado
    });
  
    return this.http.get<Apartment[]>(`${this.myAppUrl}${this.myApiUrl}`, { headers });
  }

  // Registrar un nuevo Apartamento
  addApartment(apartment: Apartment): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, apartment, { headers });
  }
}