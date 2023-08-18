import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedMarketCodeFeatureMarketCodeListingModule } from './shared-market-code-feature-market-code-listing.module';
describe('SharedMarketCodeFeatureMarketCodeListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedMarketCodeFeatureMarketCodeListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedMarketCodeFeatureMarketCodeListingModule).toBeDefined();
  });
});
