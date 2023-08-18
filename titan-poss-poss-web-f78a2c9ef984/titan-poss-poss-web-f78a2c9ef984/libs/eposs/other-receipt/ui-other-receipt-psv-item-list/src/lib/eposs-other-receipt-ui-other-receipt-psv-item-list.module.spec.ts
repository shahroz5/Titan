import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherReceiptUiOtherReceiptPsvItemListModule } from './eposs-other-receipt-ui-other-receipt-psv-item-list.module';

describe('EpossOtherReceiptUiOtherReceiptPsvItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherReceiptUiOtherReceiptPsvItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherReceiptUiOtherReceiptPsvItemListModule).toBeDefined();
  });
});
