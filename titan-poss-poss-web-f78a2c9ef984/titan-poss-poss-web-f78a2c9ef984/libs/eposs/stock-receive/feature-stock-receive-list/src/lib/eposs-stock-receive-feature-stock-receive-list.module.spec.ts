import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockReceiveFeatureStockReceiveListModule } from './eposs-stock-receive-feature-stock-receive-list.module';

describe('EpossStockReceiveFeatureStockReceiveListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockReceiveFeatureStockReceiveListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockReceiveFeatureStockReceiveListModule).toBeDefined();
  });
});
