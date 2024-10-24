import { Component, OnInit } from '@angular/core';
import { Apartment } from '../../interfaces/apartment';
import { ApartmentService } from '../../services/apartment.service';
import { TenantService } from '../../services/tenant.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from '../navbar/navbar.component';  // Importar el componente Navbar

@Component({
  selector: 'app-apartment',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,  // Asegúrate de incluir el NavbarComponent en los imports
    RouterLink,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './apartment.component.html',
  styleUrl: './apartment.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ApartmentComponent implements OnInit {
  apartments: Apartment[] = [];

  constructor(
    private apartmentService: ApartmentService,
    private tenantService: TenantService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getApartments();
  }

  getApartments(): void {
    this.apartmentService.getApartments().subscribe(
      data => {
        this.apartments = data;
        this.apartments.forEach(apartment => {
          if (apartment.tenant_id) {
            this.tenantService.getTenantById(apartment.tenant_id).subscribe(
              tenant => {
                apartment.tenant_name = tenant.name;
              },
              error => {
                console.error('Error al obtener el arrendatario:', error);
                apartment.tenant_name = 'Desconocido';
              }
            );
          } else {
            apartment.tenant_name = 'No asignado';
          }
        });
      },
      error => {
        console.error('Error al obtener los apartamentos:', error);
        alert('No se pudo obtener la lista de apartamentos.');
      }
    );
  }

  deleteApartment(apartment_id: number): void {
    this.apartmentService.deleteApartment(apartment_id).subscribe(
      response => {
        console.log("Eliminando el apartamento: " + apartment_id);
        this.apartments = this.apartments.filter(apartment => apartment.apartment_id !== apartment_id);
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Apartamento eliminado con éxito.' });
      },
      error => {
        console.error('Error al eliminar el apartamento:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el apartamento.' });
      }
    );
  }

  confirmDelete(apartment: Apartment): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar este apartamento?',
      accept: () => {
        this.deleteApartment(apartment.apartment_id);
      }
    });
  }

  showInfo(apartment: Apartment): void {
    this.router.navigate(['/info-apartment', { id: apartment.apartment_id }]);
  }

  editApartment(apartment: Apartment): void {
    this.router.navigate(['/edit-apartment', { id: apartment.apartment_id }]);
  }
}
