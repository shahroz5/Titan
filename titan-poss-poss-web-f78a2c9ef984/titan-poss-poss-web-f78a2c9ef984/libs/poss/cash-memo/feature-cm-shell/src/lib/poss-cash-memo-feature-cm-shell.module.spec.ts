import { waitForAsync, TestBed } from '@angular/core/testing';
import { PossCashMemoFeatureCmShellModule } from './poss-cash-memo-feature-cm-shell.module';

describe('PossCashMemoFeatureCmShellModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PossCashMemoFeatureCmShellModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PossCashMemoFeatureCmShellModule).toBeDefined();
  });
});
