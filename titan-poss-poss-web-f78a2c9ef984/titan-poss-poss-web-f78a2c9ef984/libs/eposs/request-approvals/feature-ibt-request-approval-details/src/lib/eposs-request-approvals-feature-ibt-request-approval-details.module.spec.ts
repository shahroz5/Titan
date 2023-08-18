import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossRequestApprovalsFeatureIbtRequestApprovalDetailsModule } from './eposs-request-approvals-feature-ibt-request-approval-details.module';

describe('EpossRequestApprovalsFeatureIbtRequestApprovalDetailsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossRequestApprovalsFeatureIbtRequestApprovalDetailsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossRequestApprovalsFeatureIbtRequestApprovalDetailsModule
    ).toBeDefined();
  });
});
