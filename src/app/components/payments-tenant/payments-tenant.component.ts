import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentsTenantService } from '../../services/payments-tenant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarTenantComponent } from '../navbar-tenant/navbar-tenant.component';
import { ContractService } from '../../services/contract.service';
@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarTenantComponent],
  templateUrl: './payments-tenant.component.html',
  styleUrls: ['./payments-tenant.component.css']
})
export class PaymentsTenantComponent {
  payments: any[] = [];
  apartmentId: number = 2;
  tenantId: number = 25;
  paymentAmount: string = '';
  notifications: string[] = [];
  paymentMethod: string = '';
  cardDetails = { cardNumber: '', cardHolder: '', expiry: '', cvv: '' };

  constructor(
    private paymentsService: PaymentsTenantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentsService.getPaymentsByTenantId(this.tenantId).subscribe({
      next: (data) => {
        this.payments = data;
      },
      error: (err) => console.error(err)
    });
  }

  showNotification(message: string): void {
    this.notifications.push(message);

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
      this.notifications.shift();
    }, 3000);
  }

  processPayment(payment: any): void {
    if (!this.paymentMethod) {
      this.showNotification('Por favor, selecciona un método de pago.');
      return;
    }

    if (payment.status === 'Pago') {
      this.showNotification('Este pago ya ha sido realizado.');
      return;
    }

    if (this.paymentMethod === 'Tarjeta de credito') {
      if (!this.cardDetails.cardNumber || !this.cardDetails.cardHolder || !this.cardDetails.expiry || !this.cardDetails.cvv) {
        this.showNotification('Por favor, completa todos los campos de la tarjeta de crédito.');
        return;
      }
    }

    const updatedPayment = {
      amount: payment.amount,
      payment_method: this.paymentMethod || payment.payment_method,
      status: 'Pago',
      payment_date: new Date(),
      tenant_id: this.tenantId,
    };

    this.paymentsService.updatePayment(payment.payment_id, updatedPayment).subscribe({
      next: () => {
        this.loadPayments();
        this.showNotification(`El pago de ${payment.amount} COP ha sido realizado correctamente.`);
        this.clearCardDetails();
      },
      error: (err) => console.error('Error al actualizar el pago:', err),
    });
  }

  selectPayment(payment: any): void {
    if (payment.status === 'Pendiente') {
      this.paymentAmount = payment.amount.toString();
      this.paymentMethod = payment.payment_method;
      this.showNotification(`Has seleccionado el pago pendiente de ${payment.amount} COP.`);
    } else {
      this.showNotification('Este pago ya está realizado.');
    }
  }

  clearCardDetails(): void {
    this.cardDetails = { cardNumber: '', cardHolder: '', expiry: '', cvv: '' };
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard-tenant']);
  }
}