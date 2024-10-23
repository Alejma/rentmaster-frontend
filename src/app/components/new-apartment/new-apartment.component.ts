import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Apartment } from '../../interfaces/apartment';
import { ApartmentService } from '../../services/apartment.service';
import { TenantService } from '../../services/tenant.service'; // Importar el servicio de tenants
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Tenant } from '../../interfaces/tenant'; // Importar la interfaz de tenants

@Component({
  selector: 'app-new-apartment',
  standalone: true,
  imports: [RouterModule, FormsModule, SpinnerComponent, CommonModule],
  templateUrl: './new-apartment.component.html',
  styleUrls: ['./new-apartment.component.css'] // Cambiar `styleUrl` a `styleUrls`
})
export class NewApartmentComponent implements OnInit { // Implementar OnInit

  apartment_id: number = 0;
  admin_id: number = 0;
  tenant_id: number = 0; // Aquí se almacenará el tenant seleccionado
  status: string = '';
  address: string = '';
  description: string = '';
  rent_price: number = 0;
  name: string = '';
  formattedRentPrice: string = ''; // Variable para el precio formateado con $

  tenants: Tenant[] = []; // Para almacenar la lista de tenants
  loading: boolean = false;

  constructor(private toastr: ToastrService,
              private _apartmentService: ApartmentService,
              private _tenantService: TenantService, // Inyectar el servicio de tenants
              private router: Router) {}

  ngOnInit() {
    this.loadTenants(); // Cargar la lista de tenants al inicializar el componente
  }

  loadTenants() {
    this.loading = true;
    this._tenantService.getTenants().subscribe((data: Tenant[]) => {
      this.tenants = data; // Almacenar los tenants en la propiedad
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.toastr.error('Error al cargar los inquilinos', 'Error');
    });
  }

  formatPrice() {
    // Eliminar caracteres no numéricos (excepto el punto para decimales)
    const numericValue = this.formattedRentPrice.replace(/[^0-9.]/g, '');

    // Verificar si el valor numérico es válido antes de asignar
    if (!isNaN(parseFloat(numericValue)) && numericValue !== '') {
      this.rent_price = parseFloat(numericValue); // Asignar valor numérico
      this.formattedRentPrice = `$${numericValue}`; // Actualizar la representación con $
    } else {
      this.rent_price = 0; // Asignar 0 si no es un número válido
      this.formattedRentPrice = ''; // Limpiar el campo si es inválido
    }
  }

  addApartment() {
    this.loading = true;

    const apartment: Apartment = {
      apartment_id: this.apartment_id,
      admin_id: this.admin_id,
      tenant_id: this.tenant_id,
      address: this.address,
      description: this.description,
      rent_price: this.rent_price, // Guardar solo el valor numérico
      status: this.status,
      name: this.name
    };

    this._apartmentService.addApartment(apartment).subscribe(data => {
      this.loading = false;
      this.toastr.success('El apartamento ' + this.apartment_id + ' fue registrado con éxito.', 'Apartamento registrado');
      this.router.navigate(['/apartments']);
    }, (event: HttpErrorResponse) => {
      this.loading = false;
      if (event.error.msg) {
        this.toastr.error(event.error.msg, 'Error');
      } else {
        this.toastr.error('Upsss! Ocurrió un error inesperado, comuníquese con el administrador.', 'Error');
      }
    });
  }
}
