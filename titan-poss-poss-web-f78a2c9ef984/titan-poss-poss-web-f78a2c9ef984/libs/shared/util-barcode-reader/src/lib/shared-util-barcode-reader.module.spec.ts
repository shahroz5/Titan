import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUtilBarcodeReaderModule } from './shared-util-barcode-reader.module';

describe('SharedUtilBarcodeReaderModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedUtilBarcodeReaderModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUtilBarcodeReaderModule).toBeDefined();
  });
});
