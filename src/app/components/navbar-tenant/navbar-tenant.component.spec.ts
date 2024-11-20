import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTenantComponent } from './navbar-tenant.component';

describe('NavbarTenantComponent', () => {
  let component: NavbarTenantComponent;
  let fixture: ComponentFixture<NavbarTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarTenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
