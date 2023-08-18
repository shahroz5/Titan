import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossStockIssueTepGepUiStockIssueTepGepItemListModule } from './eposs-stock-issue-tep-gep-ui-stock-issue-tep-gep-item-list.module';

describe('EpossStockIssueTepGepUiStockIssueTepGepItemListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossStockIssueTepGepUiStockIssueTepGepItemListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossStockIssueTepGepUiStockIssueTepGepItemListModule).toBeDefined();
  });
});
