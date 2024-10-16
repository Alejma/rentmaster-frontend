import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tenant } from '../interfaces/tenant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = 'http://localhost:3001'; 
    this.myApiUrl = '/api/tenants/'; 
  }

  getTenants(): Observable<Tenant[]> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, 
    });
  
    return this.http.get<Tenant[]>(`${this.myAppUrl}${this.myApiUrl}`, { headers });
  }

  // Registrar un nuevo Tenant
  signIn(tenant: Tenant): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, tenant);
  }

  // Login del Tenant
  login(tenant: Tenant): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/login`, tenant);
  }


  deleteTenant(id: number): Observable<any> { // Cambiar a any
    const token = localStorage.getItem('token'); // Verifica que guardaste el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Enviando el token en el encabezado
    });
    return this.http.delete<any>(`${this.myAppUrl}${this.myApiUrl}${id}`, { headers }); // Cambiar a any
  }

  updateTenant(id: number, tenant: Tenant): Observable<any> { // Cambiar a any para manejar la respuesta
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log(`PUT URL: ${this.myAppUrl}${this.myApiUrl}${id}`);
    console.log(`Authorization Header: Bearer ${token}`);
    console.log('Datos a actualizar:', tenant);
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}${id}`, tenant, { headers });
  }


  getTenantById(tenantId: number): Observable<Tenant> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, 
    });

    return this.http.get<Tenant>(`${this.myAppUrl}${this.myApiUrl}${tenantId}`, { headers }); // Asegúrate de que la URL sea correcta
  }

  getTenantHistory(apartment_id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<any>(`${this.myAppUrl}/api/tenantHistory/apartments/${apartment_id}`, { headers }); // Asegúrate de la ruta correcta
  }
  

  updateApartmentHistory(apartmentId: number, tenantId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.myAppUrl}/api/apartmentHistory/apartments/${apartmentId}`, { tenant_id: tenantId }, { headers });

  }
}
