import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedListOfValuesFeatureLovListingModule } from './shared-list-of-values-feature-lov-listing.module';

describe('SharedListOfValuesFeatureLovListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedListOfValuesFeatureLovListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedListOfValuesFeatureLovListingModule).toBeDefined();
  });
});
