import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Apartment } from '../../interfaces/apartment'; // Asegúrate de que esta ruta sea correcta
import { ApartmentService } from '../../services/apartment.service'; // Asegúrate de que esta ruta sea correcta
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-apartment',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './apartment.component.html',
  styleUrl: './apartment.component.css'
})
export class ApartmentComponent implements OnInit {
  apartments: Apartment[] = []; // Declarar un array para los apartamentos

  constructor(private apartmentService: ApartmentService) {} // Inyectar el servicio de apartamentos

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
}
