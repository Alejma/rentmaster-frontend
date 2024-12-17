import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarTenantComponent } from '../navbar-tenant/navbar-tenant.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-documents-sup',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NavbarTenantComponent],
  templateUrl: './documents-sup.component.html',
  styleUrl: './documents-sup.component.css'
})
export class DocumentsSupComponent implements OnInit {
  tenant_id: number | null = null; // Para capturar el ID del arrendatario
  documentTypes = [
    { type: 'cedula', label: 'Cédula de Ciudadanía', file: null as File | null },
    { type: 'carta_laboral', label: 'Carta Laboral', file: null as File | null },
    { type: 'comprobante_ingresos', label: 'Comprobante de Ingresos', file: null as File | null },
    { type: 'referencias', label: 'Referencias Personales o Laborales', file: null as File | null }
  ];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
  // Obtener el ID del usuario logueado desde el servicio de autenticación
    const userId = this.authService.getId();
    if (userId) {
      this.tenant_id = parseInt(userId, 10); // Convertir el ID a número
    } else {
      console.error('No se pudo obtener el ID del usuario logueado');
    }
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    const doc = this.documentTypes.find(doc => doc.type === type);
    if (doc) {
      doc.file = file;
    } else {
      console.error(`No se encontró el tipo de documento: ${type}`);
    }
  }

  onSubmit() {
    if (!this.tenant_id) {
      alert('No se encontró el ID del arrendatario. Intente iniciar sesión nuevamente.');
      return;
    }

    const formData = new FormData();
    formData.append('tenant_id', this.tenant_id.toString());

    this.documentTypes.forEach(doc => {
      if (doc.file) {
        formData.append(doc.type, doc.file);
      }
    });

    this.http.post('http://localhost:3001/api/tenants/upload-documents', formData)
      .subscribe({
        next: () => alert('Documentos subidos exitosamente'),
        error: (error) => {
          alert('Hubo un error al subir los documentos.');
          console.error(error);
        }
      });
  }
}
