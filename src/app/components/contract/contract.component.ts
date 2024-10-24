import { Component, OnInit } from '@angular/core';
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
  selectedContract: Contract | null = null;
  

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

    const modalElement = document.getElementById('contractModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
  editContract(contractId: number | undefined): void {
    if (contractId !== undefined) {
      this.router.navigate(['/edit-contract', contractId]);
    } else {
      console.error('Contract ID is undefined. Cannot navigate to edit page.');
    }
  }

/*     deleteContract(contract_id: number): void {
    this.contractService.deleteContract(contract_id).subscribe(
      response => {
        // Filtra el apartamento eliminado de la lista
        console.log("Eliminando el apartamento: " + contract_id);
        this.contracts = this.contracts.filter(contract => contract.contract_id!== contract_id);
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Apartamento eliminado con éxito.' });
      },
      error => {
        console.error('Error al eliminar el apartamento:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el apartamento.' });
      }
    );
  }

  confirmDelete(contract: Contract): void {
    if (contract.contract_id !== undefined) {
      const respuesta = confirm("¿Estás seguro de que quieres eliminar este contrato?");
      if (respuesta) {
        this.deleteContract(contract.contract_id);
        alert("Contrato eliminado.");
      } else {
        alert("Eliminación cancelada.");
      }
    } else {
      alert("El ID del contrato no es válido. No se puede eliminar.");
    }
  } */
}
