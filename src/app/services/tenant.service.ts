import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable }from '@angular/core';
import { Tenant } from '../interfaces/tenant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = 'https://rentmaster-api.onrender.com'; 
    this.myApiUrl = '/api/tenants/'; 
  }

  getTenants(): Observable<Tenant[]> {
    const token = localStorage.getItem('token'); // Verifica que guardaste el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Enviando el token en el encabezado
    });
  
    return this.http.get<Tenant[]>(`${this.myAppUrl}${this.myApiUrl}`, { headers });
    //return this.http.get<Tenant[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  // Registrar un nuevo Tenant
  signIn(tenant: Tenant): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, tenant);
  }

  // Login del Tenant
  login(tenant: Tenant): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/login`, tenant);
  }

  deleteTenant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  updateTenant(id: number, tenant: Tenant): Observable<void> {
  return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, tenant);
  }
}
