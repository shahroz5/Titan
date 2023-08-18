import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossApprovalsFeatureRequestDetailsModule } from './eposs-approvals-feature-request-details.module';

describe('EpossApprovalsFeatureRequestDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossApprovalsFeatureRequestDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossApprovalsFeatureRequestDetailsModule).toBeDefined();
  });
});
