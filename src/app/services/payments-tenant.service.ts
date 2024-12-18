import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsTenantService {
  private myAppUrl = 'http://localhost:3001';
  private myApiUrl = '/api/payments/';

  constructor(private http: HttpClient) {}

  getPaymentsByTenantId(tenantId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any[]>(`${this.myAppUrl}${this.myApiUrl}${tenantId}`, { headers });
  }

  processPayment(payment: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, payment, { headers });
  }

  updatePayment(paymentId: number, updatedPayment: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`${this.myAppUrl}${this.myApiUrl}${paymentId}`, updatedPayment, { headers });
  }
}
