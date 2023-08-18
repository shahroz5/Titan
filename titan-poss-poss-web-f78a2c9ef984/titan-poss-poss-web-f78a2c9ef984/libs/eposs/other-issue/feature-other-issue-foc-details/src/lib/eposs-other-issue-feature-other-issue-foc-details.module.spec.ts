import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherIssueFeatureOtherIssueFocDetailsModule } from './eposs-other-issue-feature-other-issue-foc-details.module';

describe('EpossOtherIssueFeatureOtherIssueFocDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherIssueFeatureOtherIssueFocDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherIssueFeatureOtherIssueFocDetailsModule).toBeDefined();
  });
});
