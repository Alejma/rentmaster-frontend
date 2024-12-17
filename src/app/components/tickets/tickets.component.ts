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

  // Lista de técnicos para asignar aleatoriamente
  technicians: string[] = ['Pedro Perez', 'Cosme Fulanito', 'Cristian Gomez', 'Camilo Velez'];
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
        //console.log('Tickets:', this.tickets);
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

  assignRandomTechnician(ticket: any): void {
    const randomTechnician = this.technicians[Math.floor(Math.random() * this.technicians.length)];
    ticket.technician = randomTechnician;

  // Llamada al servicio para actualizar el técnico en el backend
  this._ticketService.updateTicketTechnician(ticket.ticket_id, randomTechnician).subscribe(
    (updatedTicket) => {
      console.log(`Técnico ${randomTechnician} asignado al ticket ${ticket.ticket_id}`);

      // Actualiza el ticket en la lista para que la tabla refleje el cambio
      const index = this.tickets.findIndex(t => t.ticket_id === ticket.ticket_id);
      if (index !== -1) {
        this.tickets[index] = { ...this.tickets[index], technician_name: randomTechnician };
      }
    },
      (error) => {
        console.error('Error al asignar técnico:', error);
      }
    );
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
