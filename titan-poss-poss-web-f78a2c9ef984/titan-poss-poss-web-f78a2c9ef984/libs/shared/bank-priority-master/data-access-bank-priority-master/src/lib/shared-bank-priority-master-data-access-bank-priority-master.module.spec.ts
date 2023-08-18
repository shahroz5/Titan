import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedBankPriorityMasterDataAccessBankPriorityMasterModule } from './shared-bank-priority-master-data-access-bank-priority-master.module';

describe('SharedBankPriorityMasterDataAccessBankPriorityMasterModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedBankPriorityMasterDataAccessBankPriorityMasterModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      SharedBankPriorityMasterDataAccessBankPriorityMasterModule
    ).toBeDefined();
  });
});
