// src/app/components/navbar/navbar.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TenantService } from '../../services/tenant.service';
import { Tenant } from '../../interfaces/tenant';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete'; // Importar AutoCompleteSelectEvent
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AutoCompleteModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isTenantPage: boolean = false;
  tenants: Tenant[] = [];
  filteredTenants: Tenant[] = [];
  selectedTenant: Tenant | null = null;

  constructor(private router: Router, private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isTenantPage = this.router.url.includes('/tenants');
      console.log('Current URL:', this.router.url);
      console.log('isTenantPage:', this.isTenantPage);
      if (this.isTenantPage && this.tenants.length === 0) {
        this.loadTenants();
      }
    });
  }
  // Cargar la lista de arrendatarios desde el servicio
  loadTenants(): void {
    this.tenantService.getTenants().subscribe(
      (data) => {
        this.tenants = data;
        console.log('Tenants loaded:', this.tenants);
      },
      (error) => {
        console.error('Error al obtener los arrendatarios:', error);
      }
    );
  }

  // Método para filtrar los arrendatarios según el término de búsqueda
  filterTenant(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.filteredTenants = this.tenants.filter(tenant => tenant.name.toLowerCase().includes(query));
  }

  // Acción al seleccionar un arrendatario del autocompletar
  onTenantSelect(event: AutoCompleteSelectEvent): void { // Cambiado el tipo de parámetro
    const tenant = event.value as Tenant; // Extraer el Tenant del evento
    console.log('Arrendatario seleccionado:', tenant);
    // Navegar a la página de edición del arrendatario seleccionado
    this.router.navigate(['/tenants', tenant.tenant_id, 'edit']);
  }

  
}
