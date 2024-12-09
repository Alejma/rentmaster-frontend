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
import { InfoApartmentComponent } from './components/info-apartment/info-apartment.component';
import { EditApartmentComponent } from './components/edit-apartment/edit-apartment.component';
import { ContractComponent } from './components/contract/contract.component';
import { NewContractComponent } from './components/new-contract/new-contract.component';
import { EditContractComponent } from './components/edit-contract/edit-contract.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';
import { TicketsTenantComponent } from './components/tickets-tenant/tickets-tenant.component';
import { DashboardTenantComponent } from './components/dashboard-tenant/dashboard-tenant.component';
import { ResumeComponent } from './components/resume/resume.component';
import { DocumentsSupComponent } from './components/documents-sup/documents-sup.component';
import { UpdateTenantComponent } from './components/update-tenant/update-tenant.component';
import { PaymentsComponent } from './components/payments/payments.component';



export const routes: Routes = [
    {path:'', redirectTo: 'login', pathMatch:'full'},
    {path:'login', component: LoginComponent},
    {path:'signIn', component: SignInComponent},
    {path:'dashboard', component: DashboardComponent},
    {path: 'tenants', component: TenantComponent },
    {path: 'apartments', component: ApartmentComponent},
    {path: 'contracts', component: ContractComponent},
    {path: 'tickets', component: TicketsComponent},
    {path: 'create-ticket', component: CreateTicketComponent},
    {path: 'new_apartment', component: NewApartmentComponent},
    {path: 'info-apartment', component: InfoApartmentComponent},
    {path: 'edit-apartment', component: EditApartmentComponent},
    {path: 'new_contract', component: NewContractComponent},
    {path: 'edit_contract/:id', component: EditContractComponent},
    {path: 'tickets-tenant', component: TicketsTenantComponent},
    {path: 'dashboard-tenant', component: DashboardTenantComponent},
    {path: 'support-documents', component: DocumentsSupComponent},
    {path: 'resume', component: ResumeComponent},
    {path: 'update-tenant', component: UpdateTenantComponent},
    {path: 'payments', component: PaymentsComponent},
    {path:'**', component: NotFoundComponent}
    // redirectTo: 'login', pathMatch:'full'
];
