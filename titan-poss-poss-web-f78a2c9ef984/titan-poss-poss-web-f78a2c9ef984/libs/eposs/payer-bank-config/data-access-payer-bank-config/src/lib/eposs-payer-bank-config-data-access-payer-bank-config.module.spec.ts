import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossPayerBankConfigDataAccessPayerBankConfigModule } from './eposs-payer-bank-config-data-access-payer-bank-config.module';

describe('EpossPayerBankConfigurationDataAccessPayerBankConfigurationModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossPayerBankConfigDataAccessPayerBankConfigModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossPayerBankConfigDataAccessPayerBankConfigModule).toBeDefined();
  });
});
