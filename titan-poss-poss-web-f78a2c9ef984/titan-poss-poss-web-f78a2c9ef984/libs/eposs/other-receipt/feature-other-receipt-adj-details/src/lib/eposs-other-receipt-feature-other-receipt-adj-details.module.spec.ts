import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherReceiptFeatureOtherReceiptAdjDetailsModule } from './eposs-other-receipt-feature-other-receipt-adj-details.module';

describe('EpossOtherReceiptFeatureOtherReceiptAdjDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherReceiptFeatureOtherReceiptAdjDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherReceiptFeatureOtherReceiptAdjDetailsModule).toBeDefined();
  });
});
