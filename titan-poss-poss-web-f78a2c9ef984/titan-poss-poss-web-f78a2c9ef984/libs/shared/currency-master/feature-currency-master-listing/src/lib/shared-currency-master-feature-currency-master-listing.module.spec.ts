import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCurrencyMasterFeatureCurrencyMasterListingModule } from './shared-currency-master-feature-currency-master-listing.module';

describe('SharedCurrencyMasterFeatureCurrencyMasterListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCurrencyMasterFeatureCurrencyMasterListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      SharedCurrencyMasterFeatureCurrencyMasterListingModule
    ).toBeDefined();
  });
});
