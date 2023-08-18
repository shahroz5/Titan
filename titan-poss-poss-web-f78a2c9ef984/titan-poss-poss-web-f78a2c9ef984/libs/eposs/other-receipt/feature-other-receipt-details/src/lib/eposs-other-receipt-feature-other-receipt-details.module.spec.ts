import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherReceiptFeatureOtherReceiptDetailsModule } from './eposs-other-receipt-feature-other-receipt-details.module';

describe('EpossOtherReceiptFeatureOtherReceiptDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherReceiptFeatureOtherReceiptDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherReceiptFeatureOtherReceiptDetailsModule).toBeDefined();
  });
});
