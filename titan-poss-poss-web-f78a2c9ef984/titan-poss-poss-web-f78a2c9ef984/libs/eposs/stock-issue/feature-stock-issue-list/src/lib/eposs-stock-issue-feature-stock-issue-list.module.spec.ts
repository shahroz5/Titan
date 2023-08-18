import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockIssueFeatureStockIssueListModule } from './eposs-stock-issue-feature-stock-issue-list.module';

describe('EpossStockIssueFeatureStockIssueListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockIssueFeatureStockIssueListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockIssueFeatureStockIssueListModule).toBeDefined();
  });
});
