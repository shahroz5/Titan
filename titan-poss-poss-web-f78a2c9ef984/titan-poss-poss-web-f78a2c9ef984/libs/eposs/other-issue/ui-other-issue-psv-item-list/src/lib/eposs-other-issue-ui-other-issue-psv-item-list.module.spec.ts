import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherIssueUiOtherIssuePsvItemListModule } from './eposs-other-issue-ui-other-issue-psv-item-list.module';

describe('EpossOtherIssueUiOtherIssuePsvItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherIssueUiOtherIssuePsvItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherIssueUiOtherIssuePsvItemListModule).toBeDefined();
  });
});
