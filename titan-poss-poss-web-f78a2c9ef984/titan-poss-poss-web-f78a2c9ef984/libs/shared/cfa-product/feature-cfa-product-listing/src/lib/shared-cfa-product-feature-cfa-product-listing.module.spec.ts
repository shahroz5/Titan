import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCfaProductFeatureCfaProductListingModule } from './shared-cfa-product-feature-cfa-product-listing.module';

describe('SharedCfaProductFeatureCfaProductListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCfaProductFeatureCfaProductListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCfaProductFeatureCfaProductListingModule).toBeDefined();
  });
});
