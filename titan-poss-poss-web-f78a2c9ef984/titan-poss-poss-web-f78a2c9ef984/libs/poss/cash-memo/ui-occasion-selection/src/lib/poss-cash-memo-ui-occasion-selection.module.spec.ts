import { waitForAsync, TestBed } from '@angular/core/testing';
import { PossCashMemoUiOccasionSelectionModule } from './poss-cash-memo-ui-occasion-selection.module';

describe('PossCashMemoUiOccasionSelectionModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PossCashMemoUiOccasionSelectionModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PossCashMemoUiOccasionSelectionModule).toBeDefined();
  });
});
