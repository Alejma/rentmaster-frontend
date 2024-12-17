import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete'; // Importar AutoCompleteSelectEvent
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-tenant',
  standalone: true,
  imports: [AutoCompleteModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './navbar-tenant.component.html',
  styleUrl: './navbar-tenant.component.css'
})
export class NavbarTenantComponent {

}
