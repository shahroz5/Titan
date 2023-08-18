import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockIssueFeatureStockIssueHistoryDetailsModule } from './eposs-stock-issue-feature-stock-issue-history-details.module';

describe('EpossStockIssueFeatureStockIssueHistoryDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockIssueFeatureStockIssueHistoryDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockIssueFeatureStockIssueHistoryDetailsModule).toBeDefined();
  });
});
