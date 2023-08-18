import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherReceiptUiOtherReceiptAdjustmentItemListModule } from './eposs-other-receipt-ui-other-receipt-adjustment-item-list.module';

describe('EpossOtherReceiptUiOtherReceiptAdjustmentItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherReceiptUiOtherReceiptAdjustmentItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      EpossOtherReceiptUiOtherReceiptAdjustmentItemListModule
    ).toBeDefined();
  });
});
