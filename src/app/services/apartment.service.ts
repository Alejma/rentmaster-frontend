import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apartment } from '../interfaces/apartment';

@Injectable({
  providedIn: 'root',
})
export class ApartmentService {
  private readonly myAppUrl: string = 'http://localhost:3001'; 
  private readonly myApiUrl: string = '/api/apartments'; 

  constructor(private http: HttpClient) {}

  // Método para obtener los encabezados con token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
    });
  }

  // Obtener todos los apartamentos
  getApartments(): Observable<Apartment[]> {
    const headers = this.getHeaders();
    return this.http.get<Apartment[]>(`${this.myAppUrl}${this.myApiUrl}`, { headers });
  }

  // Obtener apartamentos por Tenant ID
  getApartmentsByTenantId(tenantId: number): Observable<{ id: number; name: string }[]> {
    const headers = this.getHeaders();
    return this.http.get<{ id: number; name: string }[]>(`${this.myAppUrl}${this.myApiUrl}?tenantId=${tenantId}`, { headers });
  }

  // Obtener apartamento por ID
  getApartmentById(apartment_id: number): Observable<Apartment> {
    const headers = this.getHeaders();
    return this.http.get<Apartment>(`${this.myAppUrl}${this.myApiUrl}/${apartment_id}`, { headers });
  }

  // Registrar un nuevo apartamento
  addApartment(apartment: Apartment): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, apartment, { headers });
  }

  // Actualizar apartamento existente
  updateApartment(apartment: Apartment): Observable<Apartment> {
    const headers = this.getHeaders();
    return this.http.put<Apartment>(
      `${this.myAppUrl}${this.myApiUrl}/${apartment.apartment_id}`,
      apartment,
      { headers }
    );
  }

  // Eliminar apartamento por ID
  deleteApartment(apartment_id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.myAppUrl}${this.myApiUrl}/${apartment_id}`, { headers });
  }
}
