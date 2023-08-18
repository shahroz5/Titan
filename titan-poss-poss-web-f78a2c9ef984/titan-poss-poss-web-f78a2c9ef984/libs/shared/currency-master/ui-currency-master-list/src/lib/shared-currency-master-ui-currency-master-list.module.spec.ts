import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCurrencyMasterUiCurrencyMasterListModule } from './shared-currency-master-ui-currency-master-list.module';

describe('SharedCurrencyMasterUiCurrencyMasterListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCurrencyMasterUiCurrencyMasterListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCurrencyMasterUiCurrencyMasterListModule).toBeDefined();
  });
});
