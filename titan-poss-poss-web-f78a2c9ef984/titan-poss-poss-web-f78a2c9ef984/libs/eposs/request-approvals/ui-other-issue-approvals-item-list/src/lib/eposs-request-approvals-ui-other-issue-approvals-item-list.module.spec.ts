import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { EpossRequestApprovalsUiOtherIssueApprovalsItemListModule } from './eposs-request-approvals-ui-other-issue-approvals-item-list.module';

describe('EpossRequestApprovalsUiOtherIssueApprovalsItemListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossRequestApprovalsUiOtherIssueApprovalsItemListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossRequestApprovalsUiOtherIssueApprovalsItemListModule
    ).toBeDefined();
  });
});
