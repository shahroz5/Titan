import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedBrandFeatureBrandListingModule } from './shared-brand-feature-brand-listing.module';

describe('SharedBrandFeatureBrandListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedBrandFeatureBrandListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedBrandFeatureBrandListingModule).toBeDefined();
  });
});
