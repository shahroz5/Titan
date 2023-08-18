import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossStockIssueTepGepFeatureStockIssueTepGepDetailsModule } from './eposs-stock-issue-tep-gep-feature-stock-issue-tep-gep-details.module';

describe('EpossStockIssueTepGepFeatureStockIssueTepGepDetailsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossStockIssueTepGepFeatureStockIssueTepGepDetailsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossStockIssueTepGepFeatureStockIssueTepGepDetailsModule
    ).toBeDefined();
  });
});
