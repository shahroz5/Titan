import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCountryMasterFeatureCountryMasterListingModule } from './shared-country-master-feature-country-master-listing.module';

describe('SharedCountryMasterFeatureCountryMasterListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCountryMasterFeatureCountryMasterListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCountryMasterFeatureCountryMasterListingModule).toBeDefined();
  });
});
