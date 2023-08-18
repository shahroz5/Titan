import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockReturnDataAccessStockReturnModule } from './eposs-stock-return-data-access-stock-return.module';

describe('EpossStockReturnDataAccessStockReturnModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockReturnDataAccessStockReturnModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockReturnDataAccessStockReturnModule).toBeDefined();
  });
});
