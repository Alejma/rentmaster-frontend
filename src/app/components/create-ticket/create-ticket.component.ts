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
  imports: [FormsModule, NavbarComponent, SpinnerComponent, CommonModule, RouterModule],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css'],
})
export class CreateTicketComponent implements OnInit {
  ticketData = {
    tenant_id: '', // Inicializamos vacío
    apartment_id: '', // Inicializamos vacío
    subject: '',
    description: '',
    status: '',
    technician_name: '',
  };
  descriptionOptions = ['Fallas eléctricas', 'Problemas de fontanería', 'Ruido excesivo']; // Opciones predefinidas
  selectedDescription = ''; // Valor seleccionado
  isOtherSelected = false; // Bandera para mostrar el campo personalizado

  loading: boolean = false;

  constructor(private ticketService: TicketService, private router: Router) {}

  ngOnInit() {

    const defaultTenantId = '25';
    const defaultApartmentId = '795';

    
    this.ticketData.tenant_id = defaultTenantId;
    this.ticketData.apartment_id = defaultApartmentId;

    console.log('Tenant ID establecido:', this.ticketData.tenant_id);
    console.log('Apartment ID establecido:', this.ticketData.apartment_id);
  }
  
  onDescriptionChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'Otros') {
      this.isOtherSelected = true;
      this.ticketData.description = ''; // Limpiar campo personalizado
    } else {
      this.isOtherSelected = false;
      this.ticketData.description = selectedValue; // Asignar directamente la opción seleccionada
    }
  }

  createTicket() {
    const newTicket: Ticket = {
      tenant_id: parseInt(this.ticketData.tenant_id, 10), 
      apartment_id: parseInt(this.ticketData.apartment_id, 10), 
      subject: this.ticketData.subject,
      description: this.ticketData.description,
      status: this.ticketData.status,
      technician_name: this.ticketData.technician_name,
    };

    this.ticketService.createTicket(newTicket).subscribe({
      next: (response) => {
        console.log('Ticket creado con éxito:', response);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al crear el ticket:', err);
      },
    });
  }

  resetForm() {
    this.ticketData = {
      tenant_id: this.ticketData.tenant_id, 
      apartment_id: this.ticketData.apartment_id, 
      subject: '',
      description: '',
      status: '',
      technician_name: '',
    };
  }
}
