import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherReceiptFeatureOtherReceiptPsvDetailsModule } from './eposs-other-receipt-feature-other-receipt-psv-details.module';

describe('EpossOtherReceiptFeatureOtherReceiptPsvDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherReceiptFeatureOtherReceiptPsvDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherReceiptFeatureOtherReceiptPsvDetailsModule).toBeDefined();
  });
});
