import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedStoneTypeFeatureStoneTypeListingModule } from './shared-stone-type-feature-stone-type-listing.module';

describe('SharedStoneTypeFeatureStoneTypeListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedStoneTypeFeatureStoneTypeListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedStoneTypeFeatureStoneTypeListingModule).toBeDefined();
  });
});
