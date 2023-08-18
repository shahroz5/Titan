import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossBinBinTransferUiBinBinTransferItemListModule } from './eposs-bin-bin-transfer-ui-bin-bin-transfer-item-list.module';

describe('EpossBinBinTransferUiBinBinTransferItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossBinBinTransferUiBinBinTransferItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossBinBinTransferUiBinBinTransferItemListModule).toBeDefined();
  });
});
