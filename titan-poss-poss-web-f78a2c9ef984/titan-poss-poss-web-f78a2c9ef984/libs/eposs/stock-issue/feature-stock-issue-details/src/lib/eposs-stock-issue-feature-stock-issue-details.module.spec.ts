import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockIssueFeatureStockIssueDetailsModule } from './eposs-stock-issue-feature-stock-issue-details.module';

describe('EpossStockIssueFeatureStockIssueDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockIssueFeatureStockIssueDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockIssueFeatureStockIssueDetailsModule).toBeDefined();
  });
});
