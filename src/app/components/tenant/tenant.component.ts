import { Component , OnInit} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component'
import { Tenant } from '../../interfaces/tenant';
import { TenantService } from '../../services/tenant.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-tenant',
  standalone: true,
  imports: [NavbarComponent, CommonModule,RouterLink],
  templateUrl: './tenant.component.html',
  styleUrl: './tenant.component.css'
})
export class TenantComponent implements OnInit {
  tenants: Tenant[] = [];
  selectedTenant: Tenant | null = null; // Tenant seleccionado para editar
  editedTenant: Tenant = { tenant_id: 0, name: '', email: '', password: '', payment_status: '', phone_number: '' }; // Tenant editado

  constructor(private tenantService: TenantService) {}

  ngOnInit(): void {
    this.getTenants();
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

  // Eliminar un arrendatario
  deleteTenant(tenant: Tenant) {
    if (tenant.tenant_id !== undefined) {
      const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar al arrendatario ${tenant.name}?`);
      if (confirmDelete) {
        this.tenantService.deleteTenant(tenant.tenant_id).subscribe(
          (response) => {
            console.log('Arrendatario eliminado:', response);
            this.getTenants(); // Recargar la lista de arrendatarios después de la eliminación
          },
          (error) => {
            console.error('Error al eliminar el arrendatario:', error);
          }
        );
      }
    } else {
      console.error('El tenant_id es undefined, no se puede eliminar');
    }
  }

  // Seleccionar un arrendatario para editar
  editTenant(tenant: Tenant) {
    this.selectedTenant = tenant;
    // Hacemos una copia del tenant para no modificar el original hasta que se guarde
    this.editedTenant = { ...tenant };
  }

  // Guardar cambios del arrendatario
  saveTenant() {
    if (this.editedTenant.tenant_id !== undefined) {
      this.tenantService.updateTenant(this.editedTenant.tenant_id, this.editedTenant).subscribe(
        (response) => {
          console.log('Arrendatario actualizado:', response);
          this.getTenants(); // Recargar la lista de arrendatarios después de la actualización
        },
        (error) => {
          console.error('Error al actualizar el arrendatario:', error);
        }
      );
    } else {
      console.error('El tenant_id es undefined, no se puede actualizar');
    }
  }

  // Cancelar la edición
  cancelEdit() {
    this.selectedTenant = null;
    this.editedTenant = {tenant_id: 0, name: '', email: '', password: '', payment_status: '', phone_number: '' };
  }
}