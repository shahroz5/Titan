import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockReceiveUiStockReceiveItemListModule } from './eposs-stock-receive-ui-stock-receive-item-list.module';

describe('EpossStockReceiveUiStockReceiveItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockReceiveUiStockReceiveItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockReceiveUiStockReceiveItemListModule).toBeDefined();
  });
});
