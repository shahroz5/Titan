import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCorporateTownFeatureCorporateTownListingModule } from './shared-corporate-town-feature-corporate-town-listing.module';

describe('SharedCorporateTownFeatureCorporateTownListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCorporateTownFeatureCorporateTownListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCorporateTownFeatureCorporateTownListingModule).toBeDefined();
  });
});
