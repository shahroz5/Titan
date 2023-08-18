import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossBinBinTransferDataAccessBinBinTransferModule } from './eposs-bin-bin-transfer-data-access-bin-bin-transfer.module';

describe('EpossBinBinTransferDataAccessBinBinTransferModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossBinBinTransferDataAccessBinBinTransferModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossBinBinTransferDataAccessBinBinTransferModule).toBeDefined();
  });
});
