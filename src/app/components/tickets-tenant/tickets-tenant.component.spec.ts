import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsTenantComponent } from './tickets-tenant.component';

describe('TicketsTenantComponent', () => {
  let component: TicketsTenantComponent;
  let fixture: ComponentFixture<TicketsTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsTenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
