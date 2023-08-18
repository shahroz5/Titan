import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherIssueUiOtherIssueFocItemListModule } from './eposs-other-issue-ui-other-issue-foc-item-list.module';

describe('EpossOtherIssueUiOtherIssueFocItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherIssueUiOtherIssueFocItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherIssueUiOtherIssueFocItemListModule).toBeDefined();
  });
});
