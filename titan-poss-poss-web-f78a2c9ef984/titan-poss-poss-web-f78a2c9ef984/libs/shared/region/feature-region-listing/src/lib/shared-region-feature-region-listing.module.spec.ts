import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRegionFeatureRegionListingModule } from './shared-region-feature-region-listing.module';

describe('SharedRegionFeatureRegionListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedRegionFeatureRegionListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedRegionFeatureRegionListingModule).toBeDefined();
  });
});
