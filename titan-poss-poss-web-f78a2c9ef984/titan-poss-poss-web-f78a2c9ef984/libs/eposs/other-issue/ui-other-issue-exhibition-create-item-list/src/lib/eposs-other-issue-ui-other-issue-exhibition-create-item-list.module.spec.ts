import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherIssueUiOtherIssueExhibitionCreateItemListModule } from './eposs-other-issue-ui-other-issue-exhibition-create-item-list.module';

describe('EpossOtherIssueUiOtherIssueExhibitionCreateItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherIssueUiOtherIssueExhibitionCreateItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      EpossOtherIssueUiOtherIssueExhibitionCreateItemListModule
    ).toBeDefined();
  });
});
