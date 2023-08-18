import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossPayerBankConfigUiPayerBankConfigDetailsModule } from './eposs-payer-bank-config-ui-payer-bank-config-details.module';

describe('EpossPayerBankConfigurationUiPayerBankConfigurationDetailsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossPayerBankConfigUiPayerBankConfigDetailsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossPayerBankConfigUiPayerBankConfigDetailsModule).toBeDefined();
  });
});
