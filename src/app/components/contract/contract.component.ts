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

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  public downloadContractPDF() {
    const doc = new jsPDF();
    let positionY = 30; // Posición inicial en Y después de la imagen
  
    // Cargar la imagen
    const imgPath = 'assets/img/casa1.png';
  
    const img = new Image();
    img.src = imgPath;
    img.onload = () => {
      const imgWidth = 50; // Ancho deseado de la imagen
      const imgHeight = 50; // Alto deseado de la imagen
  
      // Centrar la imagen
      const pageWidth = doc.internal.pageSize.width;
      const centerX = (pageWidth - imgWidth) / 2;
  
      // Insertar la imagen
      doc.addImage(img, 'PNG', centerX, 10, imgWidth, imgHeight);
  
      // Ajustar posición Y después de la imagen
      positionY = 70; // Espacio después de la imagen
  
      // Título centrado y más grande
      doc.setFontSize(24);
      const title = 'Lista de Contratos';
      const titleWidth = (doc.getStringUnitWidth(title) * doc.getFontSize()) / doc.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2; // Centrar título
      doc.text(title, titleX, positionY);
      positionY += 20;
  
      // Encabezado de la tabla (negrita)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('ID Contrato', 14, positionY);
      doc.text('ID Apartment', 45, positionY);
      doc.text('Arrendatario', 80, positionY);
      doc.text('Tipo de contrato', 120, positionY);
      positionY += 10;
  
      // Volver a la fuente normal para los datos
      doc.setFont('helvetica', 'normal');
  
      // Agregar datos
      this.contracts.forEach((contract) => {
        doc.text(String(contract.contract_id), 14, positionY); // Convertido a string
        doc.text(String(contract.apartment_id), 45, positionY);
        doc.text(this.getTenantName(contract.tenant_id) || 'No asignado', 80, positionY);
        doc.text(contract.type_contract || 'Desconocido', 120, positionY);
        positionY += 10;
  
        // Nueva página si se sobrepasa el límite
        if (positionY > 280) {
          doc.addPage();
          positionY = 20;
        }
      });
  
      // Guardar PDF
      doc.save('Lista de contratos.pdf');
    };
  
    img.onerror = () => {
      console.error('Error cargando la imagen desde:', imgPath);
    };
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
