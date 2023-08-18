import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossApprovalsHomeFeatureApprovalsHomeModule } from './eposs-approvals-home-feature-approvals-home.module';

describe('EpossApprovalsHomeFeatureApprovalsHomeModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossApprovalsHomeFeatureApprovalsHomeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossApprovalsHomeFeatureApprovalsHomeModule).toBeDefined();
  });
});
