import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCurrencyMasterDataAccessCurrencyMasterModule } from './shared-currency-master-data-access-currency-master.module';

describe('SharedCurrencyMasterDataAccessCurrencyMasterModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCurrencyMasterDataAccessCurrencyMasterModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCurrencyMasterDataAccessCurrencyMasterModule).toBeDefined();
  });
});
