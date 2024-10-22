import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';  
import { Ticket } from '../../interfaces/ticket';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [FormsModule, NavbarComponent,SpinnerComponent,CommonModule,RouterModule],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css'
})
export class CreateTicketComponent {
  ticketData = {
    tenant_id: '',
    apartment_id: '',
    subject: '',
    description: '',
    status: ''
  };

  loading: boolean=false;

  constructor(private ticketService: TicketService) {}

  // Función para crear un ticket
  createTicket() {
    // Convertimos tenant_id y apartment_id a números
    const newTicket: Ticket = {
      tenant_id: parseInt(this.ticketData.tenant_id, 10),  // Convertimos a número
      apartment_id: parseInt(this.ticketData.apartment_id, 10),  // Convertimos a número
      subject: this.ticketData.subject,
      description: this.ticketData.description,
      status: this.ticketData.status
    };

    // Llamamos al servicio para crear el ticket
    this.ticketService.createTicket(newTicket).subscribe({
      next: (response) => {
        console.log('Ticket creado con éxito:', response);
        // Aquí puedes resetear el formulario o hacer algo tras la creación exitosa
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al crear el ticket:', err);
      }
    });
  }

  // Función para limpiar el formulario después de crear el ticket
  resetForm() {
    this.ticketData = {
      tenant_id: '',
      apartment_id: '',
      subject: '',
      description: '',
      status: ''
    };
  }
}
