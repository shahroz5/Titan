import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedTransactionTypeMasterUiTransactionTypeMasterDetailModule } from './shared-transaction-type-master-ui-transaction-type-master-detail.module';

describe('SharedTransactionTypeMasterUiTransactionTypeMasterDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedTransactionTypeMasterUiTransactionTypeMasterDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      SharedTransactionTypeMasterUiTransactionTypeMasterDetailModule
    ).toBeDefined();
  });
});
