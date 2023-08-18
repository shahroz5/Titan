import { waitForAsync, TestBed } from '@angular/core/testing';
import { PossCashMemoUiOrderSearchModule } from './poss-cash-memo-ui-order-search.module';

describe('PossCashMemoUiOrderSearchModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PossCashMemoUiOrderSearchModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PossCashMemoUiOrderSearchModule).toBeDefined();
  });
});
