import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockReceiveFeatureStockReceiveDetailsModule } from './eposs-stock-receive-feature-stock-receive-details.module';

describe('EpossStockReceiveFeatureStockReceiveDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockReceiveFeatureStockReceiveDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockReceiveFeatureStockReceiveDetailsModule).toBeDefined();
  });
});
