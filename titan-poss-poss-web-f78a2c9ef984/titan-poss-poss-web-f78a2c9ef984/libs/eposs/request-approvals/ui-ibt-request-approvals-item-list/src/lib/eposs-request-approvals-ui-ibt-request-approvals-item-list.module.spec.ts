import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { EpossRequestApprovalsUiIbtRequestApprovalsItemListModule } from './eposs-request-approvals-ui-ibt-request-approvals-item-list.module';

describe('EpossRequestApprovalsUiIbtRequestApprovalsItemListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossRequestApprovalsUiIbtRequestApprovalsItemListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossRequestApprovalsUiIbtRequestApprovalsItemListModule
    ).toBeDefined();
  });
});
