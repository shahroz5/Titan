import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossStockIssueTepGepDataAccessStockIssueTepGepModule } from './eposs-stock-issue-tep-gep-data-access-stock-issue-tep-gep.module';

describe('EpossStockIssueTepGepDataAccessStockIssueTepGepModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossStockIssueTepGepDataAccessStockIssueTepGepModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossStockIssueTepGepDataAccessStockIssueTepGepModule).toBeDefined();
  });
});
