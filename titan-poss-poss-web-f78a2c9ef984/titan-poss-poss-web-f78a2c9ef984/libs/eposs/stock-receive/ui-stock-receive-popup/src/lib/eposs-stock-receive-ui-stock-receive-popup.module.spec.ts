import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockReceiveUiStockReceivePopupModule } from './eposs-stock-receive-ui-stock-receive-popup.module';

describe('EpossStockReceiveUiStockReceivePopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockReceiveUiStockReceivePopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockReceiveUiStockReceivePopupModule).toBeDefined();
  });
});
