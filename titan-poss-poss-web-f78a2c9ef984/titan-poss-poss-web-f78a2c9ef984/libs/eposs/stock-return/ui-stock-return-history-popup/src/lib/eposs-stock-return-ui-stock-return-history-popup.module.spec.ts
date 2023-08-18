import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockReturnUiStockReturnHistoryPopupModule } from './eposs-stock-return-ui-stock-return-history-popup.module';

describe('EpossStockReturnUiStockReturnHistoryPopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockReturnUiStockReturnHistoryPopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockReturnUiStockReturnHistoryPopupModule).toBeDefined();
  });
});
