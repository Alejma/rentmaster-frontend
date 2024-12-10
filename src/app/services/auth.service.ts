import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  role: string;
  id: string;
  apartment_id: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient, private router: Router) {}

// Método para iniciar sesión
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token); // Guardamos el token
        localStorage.setItem('role', response.role); // Guardamos el rol
        localStorage.setItem('id', response.id); // Guardar Tenant ID
        localStorage.setItem('apartment_id', response.apartment_id);
      })
    );
  }

// Método para obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  getTenantId(): string | null {
    return localStorage.getItem('tenantId');
  }

// Método para obtener el rol almacenado
  getRole(): string | null {
    return localStorage.getItem('role');
  }

// Método para obtener el ID del usuario almacenado
  getId(): string | null {
    return localStorage.getItem('id');
  }
  getApartmentId(): string | null {
    return localStorage.getItem('apartment_id');
  }

// Método para verificar si el usuario está logeado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

// Método para cerrar sesión
  logout() {
    localStorage.removeItem('token'); //Eliminamos el token, el rol y el id del local storage.
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('apartment_id')
    this.router.navigate(['/login']);
  }
}