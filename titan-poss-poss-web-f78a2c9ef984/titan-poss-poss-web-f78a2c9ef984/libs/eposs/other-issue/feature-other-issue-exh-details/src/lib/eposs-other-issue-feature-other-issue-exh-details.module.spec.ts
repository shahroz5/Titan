import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherIssueFeatureOtherIssueExhDetailsModule } from './eposs-other-issue-feature-other-issue-exh-details.module';

describe('EpossOtherIssueFeatureOtherIssueExhDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherIssueFeatureOtherIssueExhDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherIssueFeatureOtherIssueExhDetailsModule).toBeDefined();
  });
});
