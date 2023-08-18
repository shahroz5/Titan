import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossPayerBankConfigUiPayerBankConfigItemListModule } from './eposs-payer-bank-config-ui-payer-bank-config-item-list.module';

describe('EpossPayerBankConfigurationUiPayerBankConfigurationItemListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossPayerBankConfigUiPayerBankConfigItemListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossPayerBankConfigUiPayerBankConfigItemListModule).toBeDefined();
  });
});
