import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockReturnFeatureStockReturnHistoryListModule } from './eposs-stock-return-feature-stock-return-history-list.module';

describe('EpossStockReturnFeatureStockReturnHistoryListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockReturnFeatureStockReturnHistoryListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockReturnFeatureStockReturnHistoryListModule).toBeDefined();
  });
});
