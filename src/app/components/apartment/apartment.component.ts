import { Component, OnInit } from '@angular/core';
import { Apartment } from '../../interfaces/apartment';
import { ApartmentService } from '../../services/apartment.service';
import { TenantService } from '../../services/tenant.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from '../navbar/navbar.component';  // Importar el componente Navbar
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-apartment',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,  // Asegúrate de incluir el NavbarComponent en los imports
    RouterLink,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './apartment.component.html',
  styleUrl: './apartment.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ApartmentComponent implements OnInit {
  apartments: Apartment[] = [];

  constructor(
    private apartmentService: ApartmentService,
    private tenantService: TenantService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getApartments();
  }

  getApartments(): void {
    this.apartmentService.getApartments().subscribe(
      data => {
        this.apartments = data;
        this.apartments.forEach(apartment => {
          if (apartment.tenant_id) {
            this.tenantService.getTenantById(apartment.tenant_id).subscribe(
              tenant => {
                apartment.tenant_name = tenant.name;
              },
              error => {
                console.error('Error al obtener el arrendatario:', error);
                apartment.tenant_name = 'Desconocido';
              }
            );
          } else {
            apartment.tenant_name = 'No asignado';
          }
        });
      },
      error => {
        console.error('Error al obtener los apartamentos:', error);
        alert('No se pudo obtener la lista de apartamentos.');
      }
    );
  }

  deleteApartment(apartment_id: number): void {
    this.apartmentService.deleteApartment(apartment_id).subscribe(
      response => {
        console.log("Eliminando el apartamento: " + apartment_id);
        this.apartments = this.apartments.filter(apartment => apartment.apartment_id !== apartment_id);
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Apartamento eliminado con éxito.' });
      },
      error => {
        console.error('Error al eliminar el apartamento:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el apartamento.' });
      }
    );
  }

  confirmDelete(apartment: Apartment): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar este apartamento?',
      accept: () => {
        this.deleteApartment(apartment.apartment_id);
      }
    });
  }

  showInfo(apartment: Apartment): void {
    this.router.navigate(['/info-apartment', { id: apartment.apartment_id }]);
  }

  editApartment(apartment: Apartment): void {
    this.router.navigate(['/edit-apartment', { id: apartment.apartment_id }]);
  }

  updateTenant(apartment: Apartment) : void {
    this.router.navigate(['/update-tenant', { id: apartment.apartment_id }]);
  }

  public downloadApartmentPDF() {
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
      doc.setFontSize(24); // Aumenta el tamaño de la fuente
      const title = 'Lista de Apartamentos';
      const titleWidth = (doc.getStringUnitWidth(title) * doc.getFontSize()) / doc.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2; // Centrar título
      doc.text(title, titleX, positionY);
      positionY += 20;
  
      // Encabezado de la tabla (negrita)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Nombre', 14, positionY);
      doc.text('Arrendatario', 70, positionY);
      doc.text('Precio', 130, positionY);
      doc.text('Dirección', 170, positionY);
      doc.text('Estado', 230, positionY);
      positionY += 10;
  
      // Volver a la fuente normal para los datos
      doc.setFont('helvetica', 'normal');
  
      // Agregar datos
      this.apartments.forEach((apartment) => {
        doc.text(apartment.name || '', 14, positionY);
        doc.text(apartment.tenant_name || 'No asignado', 70, positionY);
        doc.text(`${apartment.rent_price}`, 130, positionY);
        doc.text(apartment.address || 'No disponible', 170, positionY);
        doc.text(apartment.status || 'Desconocido', 230, positionY);
        positionY += 10;
  
        // Nueva página si se sobrepasa el límite
        if (positionY > 280) {
          doc.addPage();
          positionY = 20;
        }
      });
  
      // Guardar PDF
      doc.save('Lista de apartamentos.pdf');
    };
  
    img.onerror = () => {
      console.error('Error cargando la imagen desde:', imgPath);
    };
  }
  
}
