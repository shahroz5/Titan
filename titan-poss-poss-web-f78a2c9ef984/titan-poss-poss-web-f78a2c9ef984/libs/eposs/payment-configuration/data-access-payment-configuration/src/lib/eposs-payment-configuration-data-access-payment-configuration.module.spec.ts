import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossPaymentConfigurationDataAccessPaymentConfigurationModule } from './eposs-payment-configuration-data-access-payment-configuration.module';

describe('EpossPaymentConfigurationDataAccessPaymentConfigurationModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossPaymentConfigurationDataAccessPaymentConfigurationModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossPaymentConfigurationDataAccessPaymentConfigurationModule
    ).toBeDefined();
  });
});
