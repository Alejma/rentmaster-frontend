import { TestBed } from '@angular/core/testing';

import { PaymentsTenantService } from './payments-tenant.service';

describe('PaymentsTenantService', () => {
  let service: PaymentsTenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentsTenantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
