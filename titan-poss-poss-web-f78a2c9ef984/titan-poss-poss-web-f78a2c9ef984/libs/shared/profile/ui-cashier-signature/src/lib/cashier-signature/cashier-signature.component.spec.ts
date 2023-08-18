import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierSignatureComponent } from './cashier-signature.component';

describe('CashierSignatureComponent', () => {
  let component: CashierSignatureComponent;
  let fixture: ComponentFixture<CashierSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
