import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../interfaces/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private myAppUrl = 'http://localhost:3001';
  private myApiUrl = '/api/payments';

  constructor(private http: HttpClient) { }

  getAllPayments(): Observable<Payment[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Payment[]>(`${this.myAppUrl}${this.myApiUrl}`, { headers });
  }
    // Obtener todos los pagos de un arrendatario
    getPaymentsByTenant(tenant_id: number): Observable<Payment[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<Payment[]>(`${this.myAppUrl}${this.myApiUrl}/${tenant_id}`, { headers });
    }
  
    // Registrar un nuevo pago
    addPayment(payment: Payment): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, payment, { headers });
    }
  
    // Actualizar un pago existente
    updatePayment(payment: Payment): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.put(`${this.myAppUrl}${this.myApiUrl}/${payment.payment_id}`, payment, { headers });
    }
}
