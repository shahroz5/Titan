import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { EpossPayerBankConfigFeaturePayerBankConfigDetailsModule } from './eposs-payer-bank-config-feature-payer-bank-config-details.module';

describe('EpossPayerBankConfigurationFeaturePayerBankConfigurationDetailsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossPayerBankConfigFeaturePayerBankConfigDetailsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossPayerBankConfigFeaturePayerBankConfigDetailsModule
    ).toBeDefined();
  });
});
