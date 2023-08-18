import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirpayVerifyPaymentComponent } from './airpay-verify-payment.component';

describe('AirpayVerifyPaymentComponent', () => {
  let component: AirpayVerifyPaymentComponent;
  let fixture: ComponentFixture<AirpayVerifyPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirpayVerifyPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirpayVerifyPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
