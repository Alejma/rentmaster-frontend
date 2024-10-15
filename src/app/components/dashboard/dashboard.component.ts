import { Component, NgModule } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { TenantService } from '../../services/tenant.service';
import { ApartmentService } from '../../services/apartment.service';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  tenantsCount: number = 0;
  apartmentsCount: number = 0;
  contractsCount: number = 0;

  constructor (
    private tenantService: TenantService,
    private apartmentService: ApartmentService,
    private contractService: ContractService
  ) {}

  ngOnInit(): void {
    this.getTenantsCount();
    this.getApartmentsCount();
    this.getContractsCount();
  }

  getTenantsCount(): void {
    this.tenantService.getTenants().subscribe(data => {
      this.tenantsCount = data.length;
    });
  }

  getApartmentsCount(): void {
    this.apartmentService.getApartments().subscribe(data => {
      this.apartmentsCount = data.length;
    });
  }

  getContractsCount(): void {
    this.contractService.getContracts().subscribe(data => {
      this.contractsCount = data.length;
    });
  }

}
