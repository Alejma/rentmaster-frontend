import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../navbar/navbar.component';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../interfaces/ticket';
import { CommonModule } from '@angular/common';
import { NavbarTenantComponent } from "../navbar-tenant/navbar-tenant.component";

@Component({
  selector: 'app-tickets-tenant',
  standalone: true,
  imports: [ CommonModule, RouterLink, NavbarTenantComponent],
  templateUrl: './tickets-tenant.component.html',
  styleUrl: './tickets-tenant.component.css'
})
export class TicketsTenantComponent {
  tenantsId = 25; // ID del arrendatario
  tickets: Ticket[] = [];

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.getTicketsByTenantId(this.tenantsId).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
      },
      error: (err) => {
        console.error('Error al cargar los tickets:', err);
      },
    });
  }
}
