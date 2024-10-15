import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApartmentService } from '../../services/apartment.service';
import { TenantService } from '../../services/tenant.service'; 
import { Apartment } from '../../interfaces/apartment';
import { Tenant } from '../../interfaces/tenant'; 
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs'; // Importamos forkJoin para sincronizar las solicitudes
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-info-apartment',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './info-apartment.component.html',
  styleUrls: ['./info-apartment.component.css']
})
export class InfoApartmentComponent implements OnInit {
  apartment: Apartment | null = null; 
  tenantName: string | null = null; // Para almacenar el nombre del arrendatario

  tenants: Tenant[] = []; 
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private apartmentService: ApartmentService,
    private _tenantService: TenantService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    const apartmentId = +this.route.snapshot.paramMap.get('id')!;
    this.loadApartmentAndTenants(apartmentId); // Cargar los datos al inicializar el componente
  }

  // Método para cargar tanto los tenants como el apartamento usando forkJoin
  loadApartmentAndTenants(apartmentId: number): void {
    this.loading = true;

    // Usamos forkJoin para cargar tanto los tenants como el apartamento al mismo tiempo
    forkJoin({
      tenants: this._tenantService.getTenants(), // Obtener lista de tenants
      apartment: this.apartmentService.getApartmentById(apartmentId) // Obtener apartamento por ID
    }).subscribe(
      (result) => {
        this.tenants = result.tenants; // Asignamos los tenants
        this.apartment = result.apartment; // Asignamos el apartamento

        // Después de cargar todo, buscamos el nombre del tenant
        this.setTenantName(this.apartment.tenant_id);

        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error('Error al cargar los datos', 'Error');
      }
    );
  }

  // Método para establecer el nombre del tenant basado en su ID
  setTenantName(tenantId: number | null): void {
    if (tenantId !== null) {
      const tenant = this.tenants.find(t => t.tenant_id === tenantId); // Busca el tenant por ID
      this.tenantName = tenant ? tenant.name : 'No disponible'; // Asigna el nombre o 'No disponible'
    } else {
      this.tenantName = 'No disponible'; // Si no hay tenantId, asigna 'No disponible'
    }
  }
}