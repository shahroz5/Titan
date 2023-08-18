import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherReceiptUiOtherReceiptItemListModule } from './eposs-other-receipt-ui-other-receipt-item-list.module';

describe('EpossOtherReceiptUiOtherReceiptItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherReceiptUiOtherReceiptItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherReceiptUiOtherReceiptItemListModule).toBeDefined();
  });
});
