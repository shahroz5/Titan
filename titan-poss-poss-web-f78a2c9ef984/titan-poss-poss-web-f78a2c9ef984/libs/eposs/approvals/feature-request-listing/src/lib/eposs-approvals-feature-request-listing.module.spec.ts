import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossApprovalsFeatureRequestListingModule } from './eposs-approvals-feature-request-listing.module';

describe('EpossApprovalsFeatureRequestListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossApprovalsFeatureRequestListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossApprovalsFeatureRequestListingModule).toBeDefined();
  });
});
