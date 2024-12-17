
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarTenantComponent } from '../navbar-tenant/navbar-tenant.component';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-dashboard-tenant',
  standalone: true,
  imports: [NavbarTenantComponent, RouterModule],
  templateUrl: './dashboard-tenant.component.html',
  styleUrl: './dashboard-tenant.component.css'
})
export class DashboardTenantComponent {

}
