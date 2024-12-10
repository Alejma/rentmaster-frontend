
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarTenantComponent } from '../navbar-tenant/navbar-tenant.component';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-dashboard-tenant',
  standalone: true,
  imports: [NavbarTenantComponent, RouterModule],
  templateUrl: './dashboard-tenant.component.html',
  styleUrl: './dashboard-tenant.component.css'
})
export class DashboardTenantComponent {
  constructor(private http: HttpClient, private _authService: AuthService) {}

  downloadInvoice() {
    const tenant_id = localStorage.getItem('id'); // Obtener el ID del usuario logueado desde el localStorage
    const token = this._authService.getToken(); // Obtener el token del localStorage
    if (!tenant_id) {
      alert('No se encontró el ID del arrendatario.');
      return;
    }

    if (!token) {
      alert('No se encontró un token de autenticación. Por favor, inicia sesión de nuevo.');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` }; //Incluir el token en el encabezado

    this.http
      .get(`http://localhost:3001/api/billing/generate-inovice/${tenant_id}`, {
        responseType: 'blob', // Indicamos que la respuesta será un archivo
        headers: headers // Adjuntar los encabezados
      })
      .subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `factura_${tenant_id}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error al descargar la factura:', error);
          alert('Hubo un error al intentar descargar la factura.');
        }
      });
  }
}
