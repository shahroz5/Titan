import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossRequestApprovalsDataAccessRequestApprovalsModule } from './eposs-request-approvals-data-access-request-approvals.module';

describe('EpossRequestApprovalsDataAccessRequestApprovalsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossRequestApprovalsDataAccessRequestApprovalsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossRequestApprovalsDataAccessRequestApprovalsModule).toBeDefined();
  });
});
