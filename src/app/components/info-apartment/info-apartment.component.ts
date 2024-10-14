import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-info-apartment',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './info-apartment.component.html',
  styleUrls: ['./info-apartment.component.css']
})
export class InfoApartmentComponent {

  constructor(private router: Router) {}

}