import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../interfaces/ticket';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css'],
})
export class CreateTicketComponent implements OnInit {
  descriptionOptions = ['Fallas eléctricas', 'Problemas de fontanería', 'Ruido excesivo', 'Otros'];
  isOtherSelected = false;

  selectedDescription: string = '';

  ticketData: Ticket = {
    tenant_id: 0,
    apartment_id: 0,
    subject: '',
    description: '',
    status: 'pendiente',
    technician_name: '',
  };

  constructor(private ticketService: TicketService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    const tenantId = localStorage.getItem('id');
    const apartmentId = localStorage.getItem('apartment_id');
  
    console.log('Tenant ID recuperado:', tenantId);
    console.log('Apartment ID recuperado:', apartmentId);
  
    if (tenantId && apartmentId) {
      this.ticketData.tenant_id = Number(tenantId) || 25;
      this.ticketData.apartment_id = Number(apartmentId) || 2;
  
      console.log('Datos del ticket:', this.ticketData);
    } else {
      alert('No se encontraron datos del usuario. Inicia sesión nuevamente.');
      this.router.navigate(['/login']);
    }
  }

  onDescriptionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.isOtherSelected = target.value === 'Otros';
    if (!this.isOtherSelected) {
      this.ticketData.description = target.value;
    }
  }

  createTicket() {
    if (!this.ticketData.subject || (!this.ticketData.description && !this.isOtherSelected)) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.ticketService.createTicket(this.ticketData).subscribe({
      next: () => {
        alert('Ticket creado con éxito.');
        this.router.navigate(['/tickets']);
      },
      error: (err) => {
        console.error('Error al crear el ticket:', err);
        alert('No se pudo crear el ticket.');
      },
    });
  }
}
