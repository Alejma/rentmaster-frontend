import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsSupComponent } from './documents-sup.component';

describe('DocumentsSupComponent', () => {
  let component: DocumentsSupComponent;
  let fixture: ComponentFixture<DocumentsSupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsSupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsSupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
