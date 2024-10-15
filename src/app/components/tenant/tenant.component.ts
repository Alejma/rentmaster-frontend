// src/app/components/tenant/tenant.component.ts

import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Tenant } from '../../interfaces/tenant';
import { TenantService } from '../../services/tenant.service';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
}
