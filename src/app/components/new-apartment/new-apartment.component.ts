import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Apartment } from '../../interfaces/apartment';
import { ApartmentService } from '../../services/apartment.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-apartment',
  standalone: true,
  imports: [RouterModule, FormsModule, SpinnerComponent, CommonModule],
  templateUrl: './new-apartment.component.html',
  styleUrl: './new-apartment.component.css'
})
export class NewApartmentComponent {

  apartment_id: number = 0;
  admin_id: number = 0;
  tenant_id: number = 0;
  status: string = '';
  address: string = '';
  description: string = '';
  rent_price: number = 0;

  loading: boolean = false;

  constructor(private toastr: ToastrService,
              private _apartmentService: ApartmentService,
              private router: Router) {}

  addApartment() {
    this.loading = true;

    const apartment: Apartment = {
      apartment_id: this.apartment_id,
      admin_id: this.admin_id,
      tenant_id: this.tenant_id,
      address: this.address,
      description: this.description,
      rent_price: this.rent_price,
      status: this.status
    };

    this._apartmentService.addApartment(apartment).subscribe(data =>{
      this.loading = false;
      this.toastr.success('El apartamento ' + this.apartment_id + ' fue registrado con exito.', 'Apartamento registrado');
      this.router.navigate(['/apartments'])
    }, (event: HttpErrorResponse) =>{
      this.loading=false;
      if(event.error.msg){
        this.toastr.error(event.error.msg, 'Error');
      } else {
        this.toastr.error('Upsss! Ocurrio un error inesperado, comuniquese con el administrador.', 'Error');
      }
    })
  }
}
