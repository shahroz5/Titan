import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossNewBinRequestUiBinDetailsPopupModule } from './eposs-new-bin-request-ui-bin-details-popup.module';

describe('EpossNewBinRequestUiBinDetailsPopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossNewBinRequestUiBinDetailsPopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossNewBinRequestUiBinDetailsPopupModule).toBeDefined();
  });
});
