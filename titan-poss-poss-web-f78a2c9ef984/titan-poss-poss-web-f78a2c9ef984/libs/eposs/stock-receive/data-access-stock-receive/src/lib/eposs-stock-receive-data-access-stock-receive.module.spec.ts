import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockReceiveDataAccessStockReceiveModule } from './eposs-stock-receive-data-access-stock-receive.module';

describe('EpossStockReceiveDataAccessStockReceiveModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockReceiveDataAccessStockReceiveModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockReceiveDataAccessStockReceiveModule).toBeDefined();
  });
});
