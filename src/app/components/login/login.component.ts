import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tenant } from '../../interfaces/tenant';
import { TenantService } from '../../services/tenant.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FormsModule, SpinnerComponent,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  payment_status: string = '';
  phone_number: string = '';

  loading: boolean=false;

  constructor(private toastr: ToastrService,
    private _tenantService: TenantService,
    private router: Router
  ){}

  login(){
    //Validamos que el usuario ingrese datos
    if(this.email=='' || this.password==''){
      this.toastr.error('Todos los campos son obligatorios.', 'Error');
      return;
    }
    //Creamos el body
    const tenant: Tenant = {
      name: this.name,
      email: this.email,
      password: this.password,
      payment_status: this.payment_status,
      phone_number: this.phone_number
    }as Omit<Tenant, 'tenant_id'>;

    this.loading=true;
    this._tenantService.login(tenant).subscribe({
      next:(token) => {
        localStorage.setItem('token',token)
        this.router.navigate(['/dashboard'])
      },
      error:(e: HttpErrorResponse) =>{
        this.msjError(e);
        this.loading=false;
      }
    })
  }
  msjError(e:HttpErrorResponse){
    if(e.error.msg){
      this.toastr.error(e.error.msg,'Error');
    }else{
      this.toastr.error('Upsss! Ocurrio un error inesperado, comuniquese con el administrador.', 'Error');
    }
  }
}
