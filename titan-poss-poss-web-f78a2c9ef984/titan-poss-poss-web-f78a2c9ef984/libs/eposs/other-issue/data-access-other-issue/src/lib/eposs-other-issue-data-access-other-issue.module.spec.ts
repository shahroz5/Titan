import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherIssueDataAccessOtherIssueModule } from './eposs-other-issue-data-access-other-issue.module';

describe('EpossOtherIssueDataAccessOtherIssueModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherIssueDataAccessOtherIssueModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherIssueDataAccessOtherIssueModule).toBeDefined();
  });
});
