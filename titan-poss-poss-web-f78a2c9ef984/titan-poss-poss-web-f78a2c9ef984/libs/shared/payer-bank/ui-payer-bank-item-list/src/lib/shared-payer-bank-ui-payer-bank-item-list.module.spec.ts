import { TestBed, waitForAsync } from '@angular/core/testing';
import { SharedPayerBankUiPayerBankItemListModule } from './shared-payer-bank-ui-payer-bank-item-list.module';

describe('SharedPayerBankUiPayerBankItemListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedPayerBankUiPayerBankItemListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedPayerBankUiPayerBankItemListModule).toBeDefined();
  });
});
