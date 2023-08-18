import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossPayerBankConfigFeaturePayerBankConfigListModule } from './eposs-payer-bank-config-feature-payer-bank-config-list.module';

describe('EpossPayerBankConfigurationFeaturePayerBankConfigurationListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossPayerBankConfigFeaturePayerBankConfigListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossPayerBankConfigFeaturePayerBankConfigListModule).toBeDefined();
  });
});
