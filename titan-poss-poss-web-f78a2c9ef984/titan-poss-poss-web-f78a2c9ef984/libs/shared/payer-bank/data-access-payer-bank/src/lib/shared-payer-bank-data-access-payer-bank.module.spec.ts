import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { SharedPayerBankDataAccessPayerBankModule } from './shared-payer-bank-data-access-payer-bank.module';

describe('SharedPayerBankDataAccessPayerBankModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedPayerBankDataAccessPayerBankModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedPayerBankDataAccessPayerBankModule).toBeDefined();
  });
});
