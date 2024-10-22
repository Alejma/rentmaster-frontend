import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../interfaces/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    /*this.myAppUrl = 'https://rentmaster-api.onrender.com'; */
    this.myAppUrl = 'http://localhost:3001';  // Cambia según tu URL de backend
    this.myApiUrl = '/api/tickets/';
  }

  // Obtener todos los tickets
  getTickets(): Observable<Ticket[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<Ticket[]>(`${this.myAppUrl}${this.myApiUrl}`, { headers });
  }

  // Obtener un ticket por su ID
  getTicketById(ticketId: number): Observable<Ticket> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<Ticket>(`${this.myAppUrl}${this.myApiUrl}${ticketId}`, { headers });
  }

  // Crear un nuevo ticket
  createTicket(ticket: Ticket): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, ticket, { headers });
  }

  // Actualizar un ticket por su ID
  updateTicket(id: number, ticket: Ticket): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}${id}`, ticket, { headers });
  }

  // Eliminar un ticket por su ID
  deleteTicket(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.delete<any>(`${this.myAppUrl}${this.myApiUrl}${id}`, { headers });
  }

  // Obtener el historial de tickets por ID de apartamento
  getTicketsByApartmentId(apartmentId: number): Observable<Ticket[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<Ticket[]>(`${this.myAppUrl}/api/ticketHistory/apartments/${apartmentId}`, { headers });
  }

  // Actualizar el historial de un ticket en relación a un apartamento
  updateTicketHistory(apartmentId: number, ticketId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.put(`${this.myAppUrl}/api/ticketHistory/apartments/${apartmentId}`, { ticket_id: ticketId }, { headers });
  }
}
