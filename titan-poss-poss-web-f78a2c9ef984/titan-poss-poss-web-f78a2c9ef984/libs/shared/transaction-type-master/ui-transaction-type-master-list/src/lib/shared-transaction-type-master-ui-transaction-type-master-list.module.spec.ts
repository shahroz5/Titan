import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedTransactionTypeMasterUiTransactionTypeMasterListModule } from './shared-transaction-type-master-ui-transaction-type-master-list.module';

describe('SharedTransactionTypeMasterUiTransactionTypeMasterListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedTransactionTypeMasterUiTransactionTypeMasterListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      SharedTransactionTypeMasterUiTransactionTypeMasterListModule
    ).toBeDefined();
  });
});
