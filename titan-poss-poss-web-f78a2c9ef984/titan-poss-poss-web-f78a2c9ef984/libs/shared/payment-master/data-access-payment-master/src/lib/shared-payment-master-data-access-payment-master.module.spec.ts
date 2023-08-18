import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedPaymentMasterDataAccessPaymentMasterModule } from './shared-payment-master-data-access-payment-master.module';

describe('SharedPaymentMasterDataAccessPaymentMasterModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedPaymentMasterDataAccessPaymentMasterModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedPaymentMasterDataAccessPaymentMasterModule).toBeDefined();
  });
});
