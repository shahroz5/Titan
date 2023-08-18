import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossRazorpayVendorConfigDataAccessRazorpayVendorConfigModule } from './eposs-razorpay-vendor-config-data-access-razorpay-vendor-config.module';

describe('EpossRazorpayVendorConfigDataAccessRazorpayVendorConfigModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossRazorpayVendorConfigDataAccessRazorpayVendorConfigModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossRazorpayVendorConfigDataAccessRazorpayVendorConfigModule).toBeDefined();
  });
});
