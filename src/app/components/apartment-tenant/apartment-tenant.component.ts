import { Component, OnInit } from '@angular/core';
import { NavbarTenantComponent } from "../navbar-tenant/navbar-tenant.component";
import { ApartmentService } from '../../services/apartment.service';
import { Apartment } from '../../interfaces/apartment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apartment-tenant',
  standalone: true,
  imports: [NavbarTenantComponent, FormsModule, CommonModule],
  templateUrl: './apartment-tenant.component.html',
  styleUrl: './apartment-tenant.component.css'
})
export class ApartmentTenantComponent implements OnInit{
  apartments: Apartment[] = [];
  selectedApartment: Apartment | null = null;
  showDetails: boolean = false;
  tenantId: number = 25; // Obtener este ID dinámicamente si es necesario

  constructor(private apartmentService: ApartmentService) {}

  ngOnInit(): void {
    this.loadApartments();
  }

  // Cargar apartamentos del inquilino
  loadApartments(): void {
    this.apartmentService.getApartmentsByTenantId(this.tenantId).subscribe({
      next: (data) => (this.apartments = data),
      error: (err) => console.error('Error al cargar apartamentos:', err),
    });
  }

  // Mostrar detalles de un apartamento
  viewApartmentDetails(apartment: Apartment): void {
    this.selectedApartment = apartment;
    this.showDetails = true;
  }

  // Cerrar el pop-up de detalles
  closeDetails(): void {
    this.showDetails = false;
    this.selectedApartment = null;
  }
}