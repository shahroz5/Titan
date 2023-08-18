import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossBinBinTransferUiBinBinTransferPopupModule } from './eposs-bin-bin-transfer-ui-bin-bin-transfer-popup.module';

describe('EpossBinBinTransferUiBinBinTransferPopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossBinBinTransferUiBinBinTransferPopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossBinBinTransferUiBinBinTransferPopupModule).toBeDefined();
  });
});
