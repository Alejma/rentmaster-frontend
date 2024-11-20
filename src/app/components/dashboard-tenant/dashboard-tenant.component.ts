import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-dashboard-tenant',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './dashboard-tenant.component.html',
  styleUrl: './dashboard-tenant.component.css'
})
export class DashboardTenantComponent {

}
