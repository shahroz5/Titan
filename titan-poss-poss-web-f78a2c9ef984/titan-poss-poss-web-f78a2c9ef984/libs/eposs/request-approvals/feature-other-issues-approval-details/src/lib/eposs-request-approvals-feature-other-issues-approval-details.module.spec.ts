import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { EpossRequestApprovalsFeatureOtherIssuesApprovalDetailsModule } from './eposs-request-approvals-feature-other-issues-approval-details.module';

describe('EpossRequestApprovalsFeatureOtherIssuesApprovalDetailsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossRequestApprovalsFeatureOtherIssuesApprovalDetailsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossRequestApprovalsFeatureOtherIssuesApprovalDetailsModule
    ).toBeDefined();
  });
});
