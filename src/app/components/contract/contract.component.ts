import { Component, OnInit, Input } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink, Router } from '@angular/router';
import { Contract} from '../../interfaces/contract';
import { Tenant } from '../../interfaces/tenant';
import { Apartment } from '../../interfaces/apartment';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../services/contract.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TenantService } from '../../services/tenant.service';
import { ApartmentService } from '../../services/apartment.service';
import { EditContractComponent } from '../edit-contract/edit-contract.component';


declare var bootstrap: any;

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, ConfirmDialogModule, ToastModule],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ContractComponent implements OnInit {
  contracts: Contract[] = [];
  tenants: Tenant[] = [];
  @Input()selectedContract: Contract | null = null;
  tenantHasDocuments: boolean = false;
  

  constructor(
    private contractService: ContractService,
    private tenantService: TenantService,  // Servicio de inquilinos
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContracts();
    this.loadTenants();  // Cargar inquilinos
    
  }

  // Método para cargar contratos
  loadContracts(): void {
    this.contractService.getContracts().subscribe((data: Contract[]) => {
      this.contracts = data;
    }, error => {
      console.error('Error al cargar los contratos:', error);
    });
  }

  // Método para cargar inquilinos
  loadTenants(): void {
    this.tenantService.getTenants().subscribe((data: Tenant[]) => {
      this.tenants = data;
    }, error => {
      console.error('Error al cargar los inquilinos:', error);
    });
  }

  // Función para obtener el nombre del inquilino basado en su ID
  getTenantName(tenantId: number | undefined): string {
    if (!tenantId) {
      return 'Inquilino no encontrado'; // Maneja el caso en que tenantId sea undefined o 0
    }
  
    const tenant = this.tenants.find(t => t.tenant_id === tenantId);
    return tenant ? tenant.name : 'Inquilino no encontrado';
  }


  // Mostrar la información completa del contrato seleccionado en el modal
  showInfo(contract: Contract): void {
    this.selectedContract = contract;

    // Verificar si el inquilino tiene documentos antes de abrir el modal
    if (this.selectedContract && this.selectedContract.tenant_id) {
      this.checkTenantDocuments(this.selectedContract.tenant_id).then(() => {
        const modalElement = document.getElementById('contractModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }).catch(() => {
        // Si hay error, simplemente abrir el modal
        const modalElement = document.getElementById('contractModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      });
    } else {
      // Si no hay contrato seleccionado o no tiene tenant_id, abrir el modal
      const modalElement = document.getElementById('contractModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  editContract(contractId: number | undefined): void {
    if (contractId !== undefined) {
      this.router.navigate(['/edit-contract', contractId]);
    } else {
      console.error('Contract ID is undefined. Cannot navigate to edit page.');
    }
  }

  
    // Verificar si el inquilino tiene documentos
    checkTenantDocuments(tenantId: number): Promise<void> {
      return new Promise((resolve, reject) => {
        this.tenantService.getTenantDocuments(tenantId).subscribe(
          (response) => {
            // Verificar si hay documentos
            this.tenantHasDocuments = response.documents.length > 0;
            resolve();
          },
          (error) => {
            console.error('Error al obtener los documentos:', error);
            this.tenantHasDocuments = false; // Si hay error, no mostrar documentos completos
            reject(error);
          }
        );
      });
    }
}
