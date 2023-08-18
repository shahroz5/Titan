import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedTaxMasterFeatureTaxMasterListingModule } from './shared-tax-master-feature-tax-master-listing.module';

describe('SharedTaxMasterFeatureTaxMasterListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedTaxMasterFeatureTaxMasterListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedTaxMasterFeatureTaxMasterListingModule).toBeDefined();
  });
});
