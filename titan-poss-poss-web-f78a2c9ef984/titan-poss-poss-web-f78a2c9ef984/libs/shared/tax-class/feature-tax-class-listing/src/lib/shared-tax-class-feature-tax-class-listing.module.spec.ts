import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedTaxClassFeatureTaxClassListingModule } from './shared-tax-class-feature-tax-class-listing.module';

describe('SharedTaxClassFeatureTaxClassListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedTaxClassFeatureTaxClassListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedTaxClassFeatureTaxClassListingModule).toBeDefined();
  });
});
