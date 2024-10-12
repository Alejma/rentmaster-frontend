import { Routes } from '@angular/router';
//components
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TenantComponent } from './components/tenant/tenant.component';
import { ApartmentComponent } from './components/apartment/apartment.component';
import { NewApartmentComponent } from './components/new-apartment/new-apartment.component';
import { not } from 'rxjs/internal/util/not';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    {path:'', redirectTo: 'login', pathMatch:'full'},
    {path:'login', component: LoginComponent},
    {path:'signIn', component: SignInComponent},
    {path:'dashboard', component: DashboardComponent},
    {path: 'tenants', component: TenantComponent },
    {path: 'apartments', component: ApartmentComponent},
    {path: 'new_apartment', component: NewApartmentComponent},
    {path:'**', component: NotFoundComponent}
    // redirectTo: 'login', pathMatch:'full'
];
