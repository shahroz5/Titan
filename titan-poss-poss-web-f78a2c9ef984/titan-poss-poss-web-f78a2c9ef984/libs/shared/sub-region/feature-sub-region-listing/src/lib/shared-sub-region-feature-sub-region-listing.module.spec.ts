import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedSubRegionFeatureSubRegionListingModule } from './shared-sub-region-feature-sub-region-listing.module';

describe('SharedSubRegionFeatureSubRegionListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedSubRegionFeatureSubRegionListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedSubRegionFeatureSubRegionListingModule).toBeDefined();
  });
});
