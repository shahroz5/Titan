import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockReceiveFeatureStockReceiveHistoryDetailsModule } from './eposs-stock-receive-feature-stock-receive-history-details.module';

describe('EpossStockReceiveFeatureStockReceiveHistoryDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockReceiveFeatureStockReceiveHistoryDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      EpossStockReceiveFeatureStockReceiveHistoryDetailsModule
    ).toBeDefined();
  });
});
