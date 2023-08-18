import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossNewBinRequestFeatureBinRequestModule } from './eposs-new-bin-request-feature-bin-request.module';

describe('EpossNewBinRequestFeatureBinRequestModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossNewBinRequestFeatureBinRequestModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossNewBinRequestFeatureBinRequestModule).toBeDefined();
  });
});
