import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { EditContractComponent } from './components/edit-contract/edit-contract.component';
import { NgApexchartsModule } from 'ng-apexcharts';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), HttpClientModule, FormsModule,provideAnimations(),provideToastr({
    timeOut: 4000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
  }), EditContractComponent, NgApexchartsModule],
};
