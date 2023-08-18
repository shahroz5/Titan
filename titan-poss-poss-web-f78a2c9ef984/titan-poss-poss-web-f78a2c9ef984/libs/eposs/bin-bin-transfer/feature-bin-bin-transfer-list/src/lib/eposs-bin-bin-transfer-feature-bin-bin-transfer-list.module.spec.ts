import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossBinBinTransferFeatureBinBinTransferListModule } from './eposs-bin-bin-transfer-feature-bin-bin-transfer-list.module';

describe('EpossBinBinTransferFeatureBinBinTransferListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossBinBinTransferFeatureBinBinTransferListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossBinBinTransferFeatureBinBinTransferListModule).toBeDefined();
  });
});
