import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirpayRefundModeComponent } from './airpay-refund-mode.component';

describe('AirpayRefundModeComponent', () => {
  let component: AirpayRefundModeComponent;
  let fixture: ComponentFixture<AirpayRefundModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirpayRefundModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirpayRefundModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
