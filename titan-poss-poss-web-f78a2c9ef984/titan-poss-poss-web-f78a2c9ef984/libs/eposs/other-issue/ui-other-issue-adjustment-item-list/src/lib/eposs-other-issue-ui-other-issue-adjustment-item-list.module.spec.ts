import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherIssueUiOtherIssueAdjustmentItemListModule } from './eposs-other-issue-ui-other-issue-adjustment-item-list.module';

describe('EpossOtherIssueUiOtherIssueAdjustmentItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherIssueUiOtherIssueAdjustmentItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherIssueUiOtherIssueAdjustmentItemListModule).toBeDefined();
  });
});
