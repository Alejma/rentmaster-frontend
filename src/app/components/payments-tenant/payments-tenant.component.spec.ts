import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsTenantComponent } from './payments-tenant.component';

describe('PaymentsTenantComponent', () => {
  let component: PaymentsTenantComponent;
  let fixture: ComponentFixture<PaymentsTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsTenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
