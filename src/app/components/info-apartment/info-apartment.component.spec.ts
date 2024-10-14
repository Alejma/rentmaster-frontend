import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoApartmentComponent } from './info-apartment.component';

describe('InfoApartmentComponent', () => {
  let component: InfoApartmentComponent;
  let fixture: ComponentFixture<InfoApartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoApartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoApartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
