import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStockIssueDataAccessStockIssueModule } from './eposs-stock-issue-data-access-stock-issue.module';

describe('EpossStockIssueDataAccessStockIssueModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossStockIssueDataAccessStockIssueModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossStockIssueDataAccessStockIssueModule).toBeDefined();
  });
});
