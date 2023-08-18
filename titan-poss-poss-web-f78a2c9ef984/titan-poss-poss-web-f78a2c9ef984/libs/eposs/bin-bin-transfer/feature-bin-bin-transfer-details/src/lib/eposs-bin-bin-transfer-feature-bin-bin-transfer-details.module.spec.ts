import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossBinBinTransferFeatureBinBinTransferDetailsModule } from './eposs-bin-bin-transfer-feature-bin-bin-transfer-details.module';

describe('EpossBinBinTransferFeatureBinBinTransferDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossBinBinTransferFeatureBinBinTransferDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossBinBinTransferFeatureBinBinTransferDetailsModule).toBeDefined();
  });
});
