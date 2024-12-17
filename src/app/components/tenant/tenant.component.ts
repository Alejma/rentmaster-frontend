// src/app/components/tenant/tenant.component.ts

import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Tenant } from '../../interfaces/tenant';
import { TenantService } from '../../services/tenant.service';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-tenant',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.css']
})
export class TenantComponent implements OnInit {
  tenants: Tenant[] = [];
  selectedTenant: Tenant | null = null; // Tenant seleccionado para editar
  editedTenant: Tenant = { tenant_id: 0, name: '', email: '', password: '', payment_status: '', phone_number: '' }; // Tenant editado
  successMessage: string = '';
  errorMessage: string = '';
  
  constructor(private tenantService: TenantService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getTenants();

    // Verificar si hay un parámetro de ruta para editar un Tenant específico
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getTenantById(+id);
      }
    });
  }

  // Obtener todos los arrendatarios
  getTenants(): void {
    this.tenantService.getTenants().subscribe(
      (data) => {
        this.tenants = data;
      },
      (error) => {
        console.error('Error al obtener los tenants:', error);
      }
    );
  }

  // Obtener un arrendatario específico por ID
  getTenantById(id: number): void {
    this.tenantService.getTenantById(id).subscribe(
      (tenant) => {
        this.selectedTenant = tenant;
        this.editedTenant = { ...tenant };
      },
      (error) => {
        console.error('Error al obtener el arrendatario:', error);
      }
    );
  }

  // Eliminar un arrendatario
  deleteTenant(tenant: Tenant) {
    if (tenant.tenant_id !== undefined) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar al arrendatario ${tenant.name}?`);
      if (confirmDelete) {
        this.tenantService.deleteTenant(tenant.tenant_id).subscribe(
          (response) => {
            this.getTenants();
          },
          (error) => {
            console.error('Error al eliminar el arrendatario:', error);
          }
        );
      }
    }
  }

  // Seleccionar un arrendatario para editar
  editTenant(tenant: Tenant) {
    this.selectedTenant = tenant;
    this.editedTenant = { ...tenant };
    
  }

  // Guardar cambios del arrendatario
  saveTenant() {
    if (this.editedTenant.tenant_id !== undefined && this.editedTenant.tenant_id !== 0) {
      this.tenantService.updateTenant(this.editedTenant.tenant_id, this.editedTenant).subscribe(
        (response) => {
          this.successMessage = response.msg;
          this.errorMessage = '';
          this.getTenants();
          this.cancelEdit();
        },
        (error) => {
          this.errorMessage = error.error.msg || 'Error al actualizar el arrendatario.';
          this.successMessage = '';
        }
      );
    } else {
      this.errorMessage = 'ID de arrendatario inválido.';
    }
  }

  // Cancelar la edición
  cancelEdit() {
    this.selectedTenant = null;
    this.editedTenant = { tenant_id: 0, name: '', email: '', password: '', payment_status: '', phone_number: '' };
  }

  public downloadTenantPDF() {
    const doc = new jsPDF();
    let positionY = 30; // Posición inicial después de la imagen
  
    // Ruta de la imagen
    const imgPath = 'assets/img/casa1.png';
  
    const img = new Image();
    img.src = imgPath;
  
    img.onload = () => {
      const imgWidth = 50; // Ancho deseado de la imagen
      const imgHeight = 50; // Alto deseado de la imagen
  
      // Calcular posición centrada de la imagen
      const pageWidth = doc.internal.pageSize.width;
      const centerX = (pageWidth - imgWidth) / 2;
  
      // Insertar la imagen centrada
      doc.addImage(img, 'PNG', centerX, 10, imgWidth, imgHeight);
  
      // Ajustar posición Y después de la imagen
      positionY = 70;
  
      // Título centrado y más grande
      doc.setFontSize(24); // Aumenta el tamaño de la fuente
      const title = 'Lista de Arrendatarios';
      const titleWidth = (doc.getStringUnitWidth(title) * doc.getFontSize()) / doc.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2; // Centrar título
      doc.text(title, titleX, positionY);
      positionY += 20;
  
      // Encabezado de la tabla (negrita)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Nombre', 14, positionY);
      doc.text('Correo', 70, positionY);
      doc.text('Teléfono', 130, positionY);
      positionY += 10;
  
      // Volver a la fuente normal para los datos
      doc.setFont('helvetica', 'normal');
  
      // Agregar datos
      this.tenants.forEach((tenant) => {
        doc.text(tenant.name || '', 14, positionY);
        doc.text(tenant.email || '', 70, positionY);
        doc.text(tenant.phone_number || 'No disponible', 130, positionY);
        positionY += 10;
  
        // Crear nueva página si se excede el límite
        if (positionY > 280) {
          doc.addPage();
          positionY = 20;
        }
      });
  
      // Guardar el PDF
      doc.save('Lista de arrendatarios.pdf');
    };
  
    img.onerror = () => {
      console.error('Error cargando la imagen desde:', imgPath);
    };
  }
}
