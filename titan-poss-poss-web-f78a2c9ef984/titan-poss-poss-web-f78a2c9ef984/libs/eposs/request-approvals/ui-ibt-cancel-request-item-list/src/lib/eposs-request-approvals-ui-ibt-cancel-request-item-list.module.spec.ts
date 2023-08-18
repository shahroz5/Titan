import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { EpossRequestApprovalsUiIbtCancelRequestItemListModule } from './eposs-request-approvals-ui-ibt-cancel-request-item-list.module';

describe('EpossRequestApprovalsUiIbtCancelRequestItemListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossRequestApprovalsUiIbtCancelRequestItemListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossRequestApprovalsUiIbtCancelRequestItemListModule).toBeDefined();
  });
});
