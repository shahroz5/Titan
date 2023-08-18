import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChequeDetailsButtonComponent } from './add-cheque-details-button.component';

describe('AddChequeDetailsButtonComponent', () => {
  let component: AddChequeDetailsButtonComponent;
  let fixture: ComponentFixture<AddChequeDetailsButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChequeDetailsButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChequeDetailsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
