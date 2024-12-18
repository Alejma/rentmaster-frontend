import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentTenantComponent } from './apartment-tenant.component';

describe('ApartmentTenantComponent', () => {
  let component: ApartmentTenantComponent;
  let fixture: ComponentFixture<ApartmentTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApartmentTenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApartmentTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
