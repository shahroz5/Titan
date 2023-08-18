import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { EpossRequestApprovalsUiRequestApprovalsItemListModule } from './eposs-request-approvals-ui-request-approvals-item-list.module';

describe('EpossRequestApprovalsUiRequestApprovalsItemListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossRequestApprovalsUiRequestApprovalsItemListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossRequestApprovalsUiRequestApprovalsItemListModule).toBeDefined();
  });
});
