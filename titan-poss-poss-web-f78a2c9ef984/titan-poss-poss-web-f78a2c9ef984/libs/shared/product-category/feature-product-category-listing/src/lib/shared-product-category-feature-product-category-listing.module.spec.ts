import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedProductCategoryFeatureProductCategoryListingModule } from './shared-product-category-feature-product-category-listing.module';

describe('SharedProductCategoryFeatureProductCategoryListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedProductCategoryFeatureProductCategoryListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      SharedProductCategoryFeatureProductCategoryListingModule
    ).toBeDefined();
  });
});
