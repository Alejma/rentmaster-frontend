import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApartmentService } from '../../services/apartment.service';
import { TenantService } from '../../services/tenant.service'; 
import { Apartment } from '../../interfaces/apartment';
import { Tenant } from '../../interfaces/tenant'; 
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs'; // Importamos 'of' para manejar errores
import { catchError } from 'rxjs/operators'; // Importamos 'catchError' para manejar el error
import { RouterLink } from '@angular/router';
import { TenantHistory } from '../../interfaces/tenant-history';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-apartment',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './info-apartment.component.html',
  styleUrls: ['./info-apartment.component.css']
})
export class InfoApartmentComponent implements OnInit {
  apartment: Apartment | null = null;
  tenantName: string | null = null;
  tenants: Tenant[] = [];
  loading: boolean = false;
  tenantHistory: TenantHistory[] = [];

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private apartmentService: ApartmentService,
    private tenantService: TenantService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const apartmentId = +this.route.snapshot.paramMap.get('id')!;
    this.loadApartmentAndTenants(apartmentId);
  }

  loadApartmentAndTenants(apartmentId: number): void {
    this.loading = true;

    forkJoin({
      tenants: this.tenantService.getTenants(),
      apartment: this.apartmentService.getApartmentById(apartmentId),
      tenantHistory: this.tenantService.getTenantHistory(apartmentId).pipe(
        catchError(() => of([])) // Si falla la carga del historial, devolvemos un array vacío
      )
    }).subscribe(
      (result) => {
        console.log('Resultados obtenidos:', result); // Log de resultados

        this.tenants = result.tenants;
        this.apartment = result.apartment;
        this.tenantHistory = result.tenantHistory;

        // Después de cargar todo, buscamos el nombre del tenant
        this.setTenantName(this.apartment.tenant_id);
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        console.error('Error detallado:', error); // Log de error
        this.toastr.error('Error al cargar los datos', 'Error');
      }
    );
  }

  setTenantName(tenantId: number | null): void {
    if (tenantId !== null) {
      const tenant = this.tenants.find(t => t.tenant_id === tenantId);
      this.tenantName = tenant ? tenant.name : 'No disponible';
    } else {
      this.tenantName = 'No disponible';
    }
  }

  getTenantNameById(tenantId: number): string {
    const tenant = this.tenants.find(t => t.tenant_id === tenantId);
    return tenant ? tenant.name : 'Desconocido';
  }
}
