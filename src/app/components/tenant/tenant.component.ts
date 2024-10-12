import { Component , OnInit} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component'
import { Tenant } from '../../interfaces/tenant';
import { TenantService } from '../../services/tenant.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-tenant',
  standalone: true,
  imports: [NavbarComponent, CommonModule,RouterLink],
  templateUrl: './tenant.component.html',
  styleUrl: './tenant.component.css'
})
export class TenantComponent implements OnInit {
  tenants: Tenant[] = [];

  constructor(private tenantService: TenantService) {}

  ngOnInit(): void {
    this.getTenants();
  }

  getTenants(): void {
    this.tenantService.getTenants().subscribe(data => {
      this.tenants = data;
    }, error => {
      console.error('Error al obtener los tenants:', error);
    });
  }
 
}