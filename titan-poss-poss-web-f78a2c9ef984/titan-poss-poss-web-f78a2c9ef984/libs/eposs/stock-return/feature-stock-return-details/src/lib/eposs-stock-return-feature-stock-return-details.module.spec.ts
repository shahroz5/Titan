import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockReturnFeatureStockReturnDetailsModule } from './eposs-stock-return-feature-stock-return-details.module';

describe('EpossStockReturnFeatureStockReturnDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockReturnFeatureStockReturnDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockReturnFeatureStockReturnDetailsModule).toBeDefined();
  });
});
