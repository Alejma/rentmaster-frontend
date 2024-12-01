import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../interfaces/ticket';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApartmentService } from '../../services/apartment.service';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [FormsModule, NavbarComponent, SpinnerComponent, CommonModule, RouterModule],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css'],
})
export class CreateTicketComponent implements OnInit {
  ticketData = {
    tenant_id: '',
    apartment_id: '',
    subject: '',
    description: '',
    status: '',
    technician_name: '',
  };

  descriptionOptions = ['Fallas eléctricas', 'Problemas de fontanería', 'Ruido excesivo'];
  selectedDescription = '';
  isOtherSelected = false;
  loading: boolean = false;

  constructor(
    private ticketService: TicketService,
    private apartmentService: ApartmentService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.ticketData.tenant_id = this.authService.getId() || '';

    if (this.ticketData.tenant_id) {
      this.apartmentService.getApartmentsByTenantId(parseInt(this.ticketData.tenant_id, 10)).subscribe({
        next: (apartments) => {
          if (apartments.length > 0) {
            this.ticketData.apartment_id = apartments[0].id.toString(); // Usa el primer apartamento
          } else {
            console.warn('No se encontraron apartamentos para este inquilino.');
          }
        },
        error: (err) => {
          console.error('Error al cargar los apartamentos:', err);
          if (err.status === 403) {
            alert('Acceso denegado. Por favor verifica tus permisos.');
          }
        },
      });
    }
  }

  onDescriptionChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'Otros') {
      this.isOtherSelected = true;
      this.ticketData.description = '';
    } else {
      this.isOtherSelected = false;
      this.ticketData.description = selectedValue;
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
        this.router.navigate(['/tickets-tenant']);
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
