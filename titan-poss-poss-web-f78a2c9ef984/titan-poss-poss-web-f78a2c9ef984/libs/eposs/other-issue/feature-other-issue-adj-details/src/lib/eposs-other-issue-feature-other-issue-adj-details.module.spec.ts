import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherIssueFeatureOtherIssueAdjDetailsModule } from './eposs-other-issue-feature-other-issue-adj-details.module';

describe('EpossOtherIssueFeatureOtherIssueAdjDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherIssueFeatureOtherIssueAdjDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherIssueFeatureOtherIssueAdjDetailsModule).toBeDefined();
  });
});
