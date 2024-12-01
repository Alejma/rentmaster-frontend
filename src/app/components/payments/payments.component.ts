import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete'; // Importar AutoCompleteSelectEvent
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarTenantComponent } from '../navbar-tenant/navbar-tenant.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NavbarTenantComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {

}
