import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tenant } from '../../interfaces/tenant';
import { TenantService } from '../../services/tenant.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, FormsModule,SpinnerComponent, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  payment_status: string = '';
  phone_number: string = '';

  loading: boolean = false;

  constructor(private toastr: ToastrService,
    private _tenantService:TenantService,
    private router: Router
  ){}

  addTenant(){
    //validar que el usuario ingrese valores
    if( this.name=='' || this.email=='' || this.password=='' || this.confirmPassword=='' || this.payment_status=='' || this.phone_number==''){
      this.toastr.error('Todos los campos son obligatorios.', 'Error');
      return;
    }
    //Validamos que las contraseñas sean iguales
    if(this.password != this.confirmPassword){
      this.toastr.error('Las contraseñas ingresadas son distintas.', 'Error');
    }
    //Creacion del body
    const tenant:Tenant = {
      tenant_id: 0,
      name: this.name,
      email: this.email,
      password: this.password,
      payment_status: this.payment_status,
      phone_number: this.phone_number,
    }

    this.loading = true;
    this._tenantService.signIn(tenant).subscribe(data =>{
      this.loading = false;
      this.toastr.success('El Arrendatario ' + this.name + ' fue registrado con exito.', 'Usuario registrado');
      this.router.navigate(['/login'])
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
