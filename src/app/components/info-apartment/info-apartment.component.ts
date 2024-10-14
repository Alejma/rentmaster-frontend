import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApartmentService } from '../../services/apartment.service';
import { Apartment } from '../../interfaces/apartment';

@Component({
  selector: 'app-info-apartment',
  standalone: true,
  templateUrl: './info-apartment.component.html',
  styleUrls: ['./info-apartment.component.css']
})
export class InfoApartmentComponent implements OnInit {
  apartment: Apartment | null = null; // Inicializa apartment como null

  constructor(private route: ActivatedRoute, private apartmentService: ApartmentService) {}

  ngOnInit(): void {
    const apartmentId = +this.route.snapshot.paramMap.get('id')!;
    this.getApartmentById(apartmentId);
  }

  getApartmentById(apartmentId: number): void {
    this.apartmentService.getApartmentById(apartmentId).subscribe(
      (data: Apartment) => {
        this.apartment = data; // Asigna los datos a la propiedad 'apartment'
      },
      error => {
        console.error('Error al obtener el apartamento:', error);
        // Manejo del error
      }
    );
  }
}
