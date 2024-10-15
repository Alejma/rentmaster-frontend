import { Component } from '@angular/core';
import { Contract} from '../../interfaces/contract';
import { Tenant } from '../../interfaces/tenant';
import { Apartment } from '../../interfaces/apartment';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { TenantService } from '../../services/tenant.service';
import { ContractService } from '../../services/contract.service';
import { ApartmentService } from '../../services/apartment.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-contract',
  standalone: true,
  imports: [RouterModule, FormsModule, SpinnerComponent, CommonModule],
  templateUrl: './new-contract.component.html',
  styleUrl: './new-contract.component.css'
})
export class NewContractComponent {
  apartment_id: number = 0; // Aquí se almacenará el apartamento seleccionado
  tenant_id: number = 0; // Aquí se almacenará el tenant seleccionado
  admin_id: number = 0;
  amount: number = 0;
  warranty: number = 0;
  type_contract: string = '';
  payment_method: string = '';
  status: string = '';
  terms_conditions: string = '';
  signed_date: string = '';
  start_date: string = '';
  end_date: string = '';

  tenants: Tenant[] = []; // Para almacenar la lista de tenants
  apartments: Apartment[] = []; // Para almacenar la lista de apartamentos
  loading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private _contractService: ContractService,
    private _tenantService: TenantService,
    private _apartmentService: ApartmentService,
    private router: Router  
  ) {}

  ngOnInit() {
    this.loadTenants(); // Cargar la lista de tenants al inicializar el componente
    this.loadApartments(); // Cargar la lista de apartamentos al inicializar el componente
  }

    // Método para cargar la lista de tenants
    loadTenants() {
      this.loading = true;
      this._tenantService.getTenants().subscribe((data: Tenant[]) => {
        this.tenants = data; // Almacenar los tenants en la propiedad
        this.loading = false;
      }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error('Error al cargar los inquilinos', 'Error');
      });
    }

    loadApartments() {
      this.loading = true;
      this._apartmentService.getApartments().subscribe((data: Apartment[]) => {
        this.apartments = data; // Almacenar los apartamentos en la propiedad
        this.loading = false;
      }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error('Error al cargar los apartamentos', 'Error');
      });
    }

    addContract() {
      this.loading = true;
  
      const contract: Contract = {
        apartment_id: this.apartment_id,
        tenant_id: this.tenant_id,
        admin_id: this.admin_id,
        amount: this.amount,
        warranty: this.warranty,
        type_contract: this.type_contract,
        payment_Method: this.payment_method,
        status: this.status,
        terms_conditions: this.terms_conditions,
        signed_date: this.signed_date,
        start_date: this.start_date,
        end_date: this.end_date
      };
  
      this._contractService.addContract(contract).subscribe(data => {
        this.loading = false;
        this.toastr.success('El contrato fue registrado con éxito.', 'Contrato registrado');
        this.router.navigate(['/contracts']); // Redirigir después de añadir el contrato
      }, (event: HttpErrorResponse) => {
        this.loading = false;
        if (event.error.msg) {
          this.toastr.error(event.error.msg, 'Error');
        } else {
          this.toastr.error('Upsss! Ocurrió un error inesperado, comuníquese con el administrador.', 'Error');
        }
      }); 
    }
}
