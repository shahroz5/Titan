import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { EpossRequestApprovalsUiBinRequestApprovalsPopupModule } from './eposs-request-approvals-ui-bin-request-approvals-popup.module';

describe('EpossRequestApprovalsUiBinRequestApprovalsPopupModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossRequestApprovalsUiBinRequestApprovalsPopupModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossRequestApprovalsUiBinRequestApprovalsPopupModule).toBeDefined();
  });
});
