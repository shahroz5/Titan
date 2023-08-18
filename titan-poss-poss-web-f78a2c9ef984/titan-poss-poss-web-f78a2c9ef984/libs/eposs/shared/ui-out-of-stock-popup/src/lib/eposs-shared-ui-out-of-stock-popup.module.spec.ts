import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossSharedUiOutOfStockPopupModule } from './eposs-shared-ui-out-of-stock-popup.module';

describe('EpossSharedUiOutOfStockPopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossSharedUiOutOfStockPopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossSharedUiOutOfStockPopupModule).toBeDefined();
  });
});
