import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Apartment } from '../../interfaces/apartment';
import { Contract } from '../../interfaces/contract';
import { Tenant } from '../../interfaces/tenant';
import { ApartmentService } from '../../services/apartment.service';
import { ContractService } from '../../services/contract.service';
import { TenantService } from '../../services/tenant.service';
import { forkJoin } from 'rxjs';
import { SpinnerComponent} from '../../shared/spinner/spinner.component';


@Component({
  selector: 'app-edit-contract',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './edit-contract.component.html',
  styleUrl: './edit-contract.component.css'
})
export class EditContractComponent implements OnInit {
  contract: Contract | null = null;
  contractId: number | null = null;

  // Variables para almacenar los valores editables del formulario
  selectedTenantId: number = 0;
  selectedApartmentId: number = 0;
  amount: number = 0;
  warranty: number = 0;
  typeContract: string = '';
  paymentMethod: string = '';
  status: string = '';
  termsConditions: string = '';
  signedDate: string = '';
  startDate: string = '';
  endDate: string = '';

  tenants: Tenant[] = [];
  apartments: Apartment[] = [];
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private contractService: ContractService,
    private tenantService: TenantService,
    private apartmentService: ApartmentService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.contractId = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.contractId);
    this.loadContractAndRelatedData(this.contractId);
  }

  // Carga tanto el contrato como los tenants y apartamentos
  loadContractAndRelatedData(contractId: number): void {
    this.loading = true;
    forkJoin({
      tenants: this.tenantService.getTenants(),
      apartments: this.apartmentService.getApartments(),
      contract: this.contractService.getContractById(contractId)
    }).subscribe(
      (result) => {
        this.tenants = result.tenants;
        this.apartments = result.apartments;
        this.contract = result.contract;

        // Inicializar los campos del formulario con los valores actuales del contrato
        this.selectedTenantId = this.contract.tenant_id;
        this.selectedApartmentId = this.contract.apartment_id;
        this.amount = this.contract.amount;
        this.warranty = this.contract.warranty;
        this.typeContract = this.contract.type_contract;
        this.paymentMethod = this.contract.payment_Method;
        this.status = this.contract.status || 'activo';
        this.termsConditions = this.contract.terms_conditions || '';
        this.signedDate = this.contract.signed_date.split('T')[0]; // Solo la parte de la fecha
        this.startDate = this.contract.start_date.split('T')[0];
        this.endDate = this.contract.end_date.split('T')[0];

        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error('Error al cargar los datos', 'Error');
      }
    );
  }

  updateContract(): void {
    if (!this.contract) {
      return;
    }

    // Crear el objeto con los datos actualizados del contrato
    const updatedContract: Contract = {
      ...this.contract, // Mantiene los datos originales no modificados
      tenant_id: this.selectedTenantId,
      apartment_id: this.selectedApartmentId,
      amount: this.amount,
      warranty: this.warranty,
      type_contract: this.typeContract,
      payment_Method: this.paymentMethod,
      status: this.status,
      terms_conditions: this.termsConditions,
      signed_date: new Date(this.signedDate).toISOString(), // Convertir la fecha al formato ISO
      start_date: new Date(this.startDate).toISOString(),
      end_date: new Date(this.endDate).toISOString()
    };

    this.loading = true;

    this.contractService.updateContract(updatedContract).subscribe(
      () => {
        this.loading = false;
        this.toastr.success('El contrato ha sido actualizado con éxito.', 'Actualización exitosa');
        this.router.navigate(['/contracts']);
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error('Error al actualizar el contrato', 'Error');
      }
    );
  }
}
