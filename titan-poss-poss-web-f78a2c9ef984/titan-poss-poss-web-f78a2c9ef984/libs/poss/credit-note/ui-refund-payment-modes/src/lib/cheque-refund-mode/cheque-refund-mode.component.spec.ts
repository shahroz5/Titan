import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeRefundModeComponent } from './cheque-refund-mode.component';

describe('ChequeRefundModeComponent', () => {
  let component: ChequeRefundModeComponent;
  let fixture: ComponentFixture<ChequeRefundModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChequeRefundModeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeRefundModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
