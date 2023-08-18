import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossNewBinRequestUiBinRequestBinListModule } from './eposs-new-bin-request-ui-bin-request-bin-list.module';

describe('EpossNewBinRequestUiBinRequestBinListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossNewBinRequestUiBinRequestBinListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossNewBinRequestUiBinRequestBinListModule).toBeDefined();
  });
});
