import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Tenant } from '../../interfaces/tenant';
import { TenantService } from '../../services/tenant.service';
import { ApartmentService } from '../../services/apartment.service';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../interfaces/ticket';
import { Apartment } from '../../interfaces/apartment';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [NavbarComponent, CommonModule,],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent {
  tickets: Ticket[] = [];
  tenants: Tenant[] = [];
  apartments: Apartment[] = [];

  // Variables para contar los tickets por estado
  pendingCount: number = 0;
  inProgressCount: number = 0;
  resolvedCount: number = 0;
  
  constructor(private _ticketService: TicketService,
           private _tenantService: TenantService,
              private _apartmentService: ApartmentService,
  ) { }


  ngOnInit() {
    this.loadTickets();
    this.loadTenants();
    this.loadApartments();
  }

  loadTickets() {
    this._ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.updateTicketCounts(); // Actualizar los contadores de tickets
      }
    });
  }

  loadTenants(): void {
    this._tenantService.getTenants().subscribe((data) => {
      this.tenants = data;
    });
  }

    loadApartments(): void {
      this._apartmentService.getApartments().subscribe((data) => {
        this.apartments = data;
      });
    }

  getTenantName(tenantId: number): string {
    const tenant = this.tenants.find(t => t.tenant_id === tenantId);
    
    return tenant ? tenant.name : 'Desconocido';
  }

  getApartmentName(apartmentId: number): string {
    const apartment = this.apartments.find(a => a.apartment_id === apartmentId);
    return apartment ? apartment.name : 'Desconocido';
  }

  updateTicketCounts(): void {
    this.pendingCount = this.tickets.filter(ticket => ticket.status === 'Pendiente').length;
    this.inProgressCount = this.tickets.filter(ticket => ticket.status === 'En Proceso').length;
    this.resolvedCount = this.tickets.filter(ticket => ticket.status === 'Resuelto').length;
  }

    // Función que cambia el estado del ticket y actualiza la API
    changeStatus(ticket: any, status: string): void {
      ticket.status = status;  // Actualizar el estado en la vista
      this._ticketService.updateTicketStatus(ticket.ticket_id, status).subscribe(
        (response) => {
          console.log(`Ticket ${ticket.ticket_id} updated successfully`);
        },
        (error) => {
          console.error('Error updating ticket status', error);
        }
      );
    }

}
