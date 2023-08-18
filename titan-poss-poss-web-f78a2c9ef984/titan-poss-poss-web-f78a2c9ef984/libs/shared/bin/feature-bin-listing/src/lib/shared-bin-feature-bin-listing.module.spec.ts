import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedBinFeatureBinListingModule } from './shared-bin-feature-bin-listing.module';

describe('SharedBinFeatureBinListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedBinFeatureBinListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedBinFeatureBinListingModule).toBeDefined();
  });
});
