import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { EpossRequestApprovalsFeatureRequestApprovalListingModule } from './eposs-request-approvals-feature-request-approval-listing.module';

describe('EpossRequestApprovalsFeatureRequestApprovalListingModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossRequestApprovalsFeatureRequestApprovalListingModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossRequestApprovalsFeatureRequestApprovalListingModule
    ).toBeDefined();
  });
});
