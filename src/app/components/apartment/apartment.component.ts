import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Apartment } from '../../interfaces/apartment'; // Asegúrate de que esta ruta sea correcta
import { ApartmentService } from '../../services/apartment.service'; // Asegúrate de que esta ruta sea correcta
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-apartment',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, ConfirmDialogModule, ToastModule],
  templateUrl: './apartment.component.html',
  styleUrl: './apartment.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ApartmentComponent implements OnInit {
  apartments: Apartment[] = []; // Declarar un array para los apartamentos

  constructor(private apartmentService: ApartmentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router) {} // Inyectar el servicio de apartamentos

  ngOnInit(): void {
    this.getApartments(); // Llamar al método para obtener los apartamentos al iniciar
  }

  getApartments(): void {
    this.apartmentService.getApartments().subscribe(
      data => {
        this.apartments = data; // Asignar los datos a la propiedad 'apartments'
      },
      error => {
        console.error('Error al obtener los apartamentos:', error);
        // Aquí puedes mostrar un mensaje al usuario
        alert('No se pudo obtener la lista de apartamentos. Asegúrate de estar autenticado.');
      }
    );
  }

  deleteApartment(apartment_id: number): void {
    this.apartmentService.deleteApartment(apartment_id).subscribe(
      response => {
        // Filtra el apartamento eliminado de la lista
        console.log("Eliminando el apartamento: " + apartment_id)
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
    const respuesta = confirm("¿Estás seguro de que quieres eliminar este apartamento?");
    if (respuesta) {   
      this.deleteApartment(apartment.apartment_id);
      alert("Apartamento eliminado."); // Puedes reemplazar esto con tu lógica de eliminación
    } else {
      alert("Eliminación cancelada.");
    }
  }

  showInfo(apartment: Apartment) {

    console.log('Información del apartamento: ' + apartment.apartment_id + "\nnombre: " + apartment.name); // Muestra la información del apartamento en la consola
    this.router.navigate(['/info-apartment', { id: apartment.apartment_id }]); 
  }

  editApartment(apartment: Apartment)  {
    this.router.navigate(['/edit-apartment', { id: apartment.apartment_id }]); 
  }

}