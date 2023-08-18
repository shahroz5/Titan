import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossRequestApprovalsUiBinRequestItemListModule } from './eposs-request-approvals-ui-bin-request-item-list.module';

describe('EpossRequestApprovalsUiBinRequestItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossRequestApprovalsUiBinRequestItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossRequestApprovalsUiBinRequestItemListModule).toBeDefined();
  });
});
