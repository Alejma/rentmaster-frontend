import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTenantComponent } from './dashboard-tenant.component';

describe('DashboardTenantComponent', () => {
  let component: DashboardTenantComponent;
  let fixture: ComponentFixture<DashboardTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
