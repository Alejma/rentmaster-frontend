import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete'; // Importar AutoCompleteSelectEvent
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarTenantComponent } from '../navbar-tenant/navbar-tenant.component';
import { Contract } from '../../interfaces/contract';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NavbarTenantComponent],
  templateUrl: './payments-tenant.component.html',
  styleUrls: ['./payments-tenant.component.css']
})
export class PaymentsTenantComponent implements OnInit {
  apartmentId: number = 2; // ID predefinido del apartamento
  paymentAmount: number = 700000; // Monto fijo del contrato en COP
  paymentMethod: string = ''; // Método de pago seleccionado
  cardDetails: { cardNumber: string; cardHolder: string; expiry: string; cvv: string } = {
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  };

  constructor(private contractService: ContractService, private router: Router) {}

  ngOnInit(): void {
  }

  // Método para cargar el contrato asociado al apartamento predefinido


  // Método para manejar el pago (se puede personalizar según sea necesario)
  processPayment(): void {
    if (this.paymentMethod === 'CreditCard') {
      if (
        !this.cardDetails.cardNumber ||
        !this.cardDetails.cardHolder ||
        !this.cardDetails.expiry ||
        !this.cardDetails.cvv
      ) {
        alert('Por favor, completa todos los campos de la tarjeta de crédito.');
        return;
      }
      console.log('Detalles de tarjeta:', this.cardDetails);
    }
    alert(`El pago de ${this.paymentAmount} COP para el apartamento ${this.apartmentId} ha sido realizado con éxito.`);
  }



  // Redirección al dashboard
  goToDashboard(): void {
    this.router.navigate(['/dashboard-tenant']);
  }
}