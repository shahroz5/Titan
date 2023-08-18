import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedBinUiBinPopupModule } from './shared-bin-ui-bin-popup.module';

describe('SharedBinUiBinPopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedBinUiBinPopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedBinUiBinPopupModule).toBeDefined();
  });
});
