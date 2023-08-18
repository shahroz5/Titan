import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherIssueFeatureOtherIssueExhCreateRequestModule } from './eposs-other-issue-feature-other-issue-exh-create-request.module';

describe('EpossOtherIssueFeatureOtherIssueExhCreateRequestModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherIssueFeatureOtherIssueExhCreateRequestModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      EpossOtherIssueFeatureOtherIssueExhCreateRequestModule
    ).toBeDefined();
  });
});
