import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApartmentService } from '../../services/apartment.service';
import { TenantService } from '../../services/tenant.service'; 
import { Apartment } from '../../interfaces/apartment';
import { Tenant } from '../../interfaces/tenant'; 
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs'; 
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-tenant',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './update-tenant.component.html',
  styleUrls: ['./update-tenant.component.css']
})
export class UpdateTenantComponent implements OnInit {
  apartment: Apartment | null = null;
  apartmentName: string = '';
  apartmentAddress: string = '';
  rentPrice: number = 0;
  selectedTenantId: number = 0;
  description: string = '';
  status: string = '';
  tenants: Tenant[] = [];
  loading: boolean = false;

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
      apartment: this.apartmentService.getApartmentById(apartmentId)
    }).subscribe(
      (result) => {
        this.tenants = result.tenants;
        this.apartment = result.apartment;
        this.apartmentName = this.apartment.name;
        this.apartmentAddress = this.apartment.address;
        this.rentPrice = this.apartment.rent_price;
        this.selectedTenantId = this.apartment.tenant_id;
        this.description = this.apartment.description || '';
        this.status = this.apartment.status || 'disponible';
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error('Error al cargar los datos', 'Error');
      }
    );
  }

  updateTenant(): void {
    if (!this.apartment || this.selectedTenantId === 0) {
      this.toastr.error('Debe seleccionar un arrendatario válido.', 'Error');
      return;
    }

    const updatedApartment = {
      ...this.apartment,
      tenant_id: this.selectedTenantId
    };

    this.apartmentService.updateApartment(updatedApartment).subscribe(
      (apartment) => {
        this.toastr.success('Arrendatario actualizado con éxito.', 'Éxito');
        this.addTenantHistory(this.apartment!.apartment_id, this.selectedTenantId);
        this.router.navigate(['/apartments']);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error('Error al actualizar el arrendatario.', 'Error');
      }
    );
  }

  private addTenantHistory(apartmentId: number, tenantId: number): void {
    this.tenantService.addTenantHistory(apartmentId, tenantId).subscribe(
      (response) => {
        console.log('Historial actualizado:', response);
      },
      (error) => {
        console.error('Error al actualizar el historial:', error);
        this.toastr.error('No se pudo actualizar el historial.', 'Error');
      }
    );
  }
}
