import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherIssueUiOtherIssueExhibitionItemListModule } from './eposs-other-issue-ui-other-issue-exhibition-item-list.module';

describe('EpossOtherIssueUiOtherIssueExhibitionItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherIssueUiOtherIssueExhibitionItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherIssueUiOtherIssueExhibitionItemListModule).toBeDefined();
  });
});
