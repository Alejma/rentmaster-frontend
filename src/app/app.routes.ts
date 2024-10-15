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
import { ContractComponent } from './components/contract/contract.component';
import { NewContractComponent } from './components/new-contract/new-contract.component';
import { EditContractComponent } from './components/edit-contract/edit-contract.component';

export const routes: Routes = [
    {path:'', redirectTo: 'login', pathMatch:'full'},
    {path:'login', component: LoginComponent},
    {path:'signIn', component: SignInComponent},
    {path:'dashboard', component: DashboardComponent},
    {path: 'tenants', component: TenantComponent },
    {path: 'apartments', component: ApartmentComponent},
    {path: 'contracts', component: ContractComponent},
    {path: 'new_apartment', component: NewApartmentComponent},
    {path: 'new_contract', component: NewContractComponent},
    {path: 'edit_contract/:id', component: EditContractComponent},
    {path:'**', component: NotFoundComponent}
    // redirectTo: 'login', pathMatch:'full'
];
