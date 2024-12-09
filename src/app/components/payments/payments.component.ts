import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../interfaces/payment';
import { CommonModule } from '@angular/common';
import { Tenant } from '../../interfaces/tenant';
import { TenantService } from '../../services/tenant.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  Payments: Payment[] = [];
  tenants: Tenant[] = [];
  paymentForm!: FormGroup;

  constructor(private paymentService: PaymentService, private fb: FormBuilder, private tenantService: TenantService){}
  ngOnInit(): void {
    this.loadPayments();
    this.initForm();
    this.loadTenants();
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      tenant_id: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      payment_date: [null],
      payment_method: [null],
      status: [null, [Validators.required]]
    });
  }

  loadPayments(): void {
    const tenantId = 25; // Reemplazar con el ID del arrendatario actual si es necesario
    this.paymentService.getPaymentsByTenant(tenantId).subscribe({
      next: (data) => (this.Payments = data),
      error: (err) => console.error('Error fetching payments:', err)
    });
  }
/*     loadPayments(): void {
      this.paymentService.getAllPayments().subscribe({
        next: (data) => (this.Payments = data),
        error: (err) => console.error('Error fetching payments:', err)
      });
    }
 */
  addPayment(): void {
    const newPayment: Payment = this.paymentForm.value;
    this.paymentService.addPayment(newPayment).subscribe({
      next: () => {
        this.paymentForm.reset();
        this.loadPayments();
      },
      error: (err) => console.error('Error adding payment:', err)
    });
  }

  loadTenants(): void {
    this.tenantService.getTenants().subscribe({
      next: (data) => (this.tenants = data),
      error: (err) => console.error('Error fetching tenants:', err)
    });
  }
}
