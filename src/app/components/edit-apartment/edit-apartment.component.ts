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
  selector: 'app-edit-apartment',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './edit-apartment.component.html',
  styleUrls: ['./edit-apartment.component.css']
})
export class EditApartmentComponent implements OnInit {
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

  updateApartment(): void {
    if (!this.apartment) {
      return; // Salimos si el apartamento es null
    }

    const updatedApartment: Apartment = {
      ...this.apartment,
      name: this.apartmentName,
      address: this.apartmentAddress,
      rent_price: this.rentPrice,
      tenant_id: this.selectedTenantId,
      description: this.description,
      status: this.status
    };

    this.loading = true;

    // Actualiza el apartamento
    this.apartmentService.updateApartment(updatedApartment).subscribe(
      () => {
        // Verificamos que this.apartment no sea null antes de llamar a updateApartmentHistory
        if (this.apartment) {
          // Actualiza el historial del apartamento
          this.tenantService.updateApartmentHistory(this.apartment.apartment_id, this.selectedTenantId).subscribe(
            () => {
              this.loading = false;
              this.toastr.success('El apartamento y su historial han sido actualizados con éxito.', 'Actualización exitosa');
              this.router.navigate(['/apartments']);
            },
            (error: HttpErrorResponse) => {
              this.loading = false;
              this.toastr.error('Error al actualizar el historial del apartamento', 'Error');
            }
          );
        }
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error('Error al actualizar el apartamento', 'Error');
      }
    );
  }

  get formattedRentPrice(): string {
    return `$${this.rentPrice.toFixed(2)}`;
  }

  updateRentPrice(value: string): void {
    this.rentPrice = parseFloat(value.replace(/[$,]/g, '')); // Elimina el símbolo $ y convierte a número
  }
}
