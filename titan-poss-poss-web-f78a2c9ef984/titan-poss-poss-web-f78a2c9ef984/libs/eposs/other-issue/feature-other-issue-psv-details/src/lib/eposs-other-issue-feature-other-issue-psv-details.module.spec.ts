import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherIssueFeatureOtherIssuePsvDetailsModule } from './eposs-other-issue-feature-other-issue-psv-details.module';

describe('EpossOtherIssueFeatureOtherIssuePsvDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherIssueFeatureOtherIssuePsvDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherIssueFeatureOtherIssuePsvDetailsModule).toBeDefined();
  });
});
