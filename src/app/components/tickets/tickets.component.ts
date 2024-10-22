import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Tenant } from '../../interfaces/tenant';
import { TenantService } from '../../services/tenant.service';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterLink, FormsModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent {

}
