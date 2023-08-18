import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossOtherReceiptDataAccessOtherReceiptModule } from './eposs-other-receipt-data-access-other-receipt.module';

describe('EpossOtherReceiptDataAccessOtherReceiptModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossOtherReceiptDataAccessOtherReceiptModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossOtherReceiptDataAccessOtherReceiptModule).toBeDefined();
  });
});
