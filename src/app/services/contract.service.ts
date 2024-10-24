import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Contract } from '../interfaces/contract';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = 'https://rentmaster-api.onrender.com';
    this.myApiUrl = '/api/contracts';
   }

   getContracts(): Observable<Contract[]> {
    const token = localStorage.getItem('token'); // Verifica que guardaste el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Enviando el token en el encabezado
    });
  
    return this.http.get<Contract[]>(`${this.myAppUrl}${this.myApiUrl}`, { headers });
  }

  addContract(contract: Contract): Observable<Contract> {
    const token = localStorage.getItem('token'); // Verifica que guardaste el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Enviando el token en el encabezado
    });
  
    return this.http.post<Contract>(`${this.myAppUrl}${this.myApiUrl}`, contract, { headers });
    
   }

    updateContract(contract: Contract): Observable<Contract> {
      const token = localStorage.getItem('token'); // Verifica que guardaste el token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`, // Enviando el token en el encabezado
      });
    
      return this.http.put<Contract>(`${this.myAppUrl}${this.myApiUrl}`, contract, { headers });
    }

    deleteContract(contractId: number): Observable<Contract> {
      const token = localStorage.getItem('token'); // Verifica que guardaste el token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`, // Enviando el token en el encabezado
      });
    
      return this.http.delete<Contract>(`${this.myAppUrl}${this.myApiUrl}/${contractId}`, { headers });
    }

    getContractById(contractId: number): Observable<Contract> {
      const token = localStorage.getItem('token'); // Verifica que guardaste el token
      const headers = new HttpHeaders({ // Enviando el token en el encabezado
        'Authorization': `Bearer ${token}`,
      });
      return this.http.get<Contract>(`${this.myAppUrl}${this.myApiUrl}/${contractId}`, { headers });
}
}
