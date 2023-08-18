import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockReturnUiStockReturnItemListModule } from './eposs-stock-return-ui-stock-return-item-list.module';

describe('EpossStockReturnUiStockReturnItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockReturnUiStockReturnItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockReturnUiStockReturnItemListModule).toBeDefined();
  });
});
