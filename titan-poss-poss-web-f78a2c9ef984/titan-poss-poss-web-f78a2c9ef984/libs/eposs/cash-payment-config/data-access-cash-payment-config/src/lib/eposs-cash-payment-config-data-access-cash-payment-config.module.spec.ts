import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossCashPaymentConfigDataAccessCashPaymentConfigModule } from './eposs-cash-payment-config-data-access-cash-payment-config.module';

describe('EpossCashPaymentConfigDataAccessCashPaymentConfigModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        EpossCashPaymentConfigDataAccessCashPaymentConfigModule
      ]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      EpossCashPaymentConfigDataAccessCashPaymentConfigModule
    ).toBeDefined();
  });
});
