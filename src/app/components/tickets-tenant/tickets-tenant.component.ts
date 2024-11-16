import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-tickets-tenant',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './tickets-tenant.component.html',
  styleUrl: './tickets-tenant.component.css'
})
export class TicketsTenantComponent {

}
