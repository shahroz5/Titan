import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossNewBinRequestFeatureBinDetailsModule } from './eposs-new-bin-request-feature-bin-details.module';

describe('EpossNewBinRequestFeatureBinDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossNewBinRequestFeatureBinDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossNewBinRequestFeatureBinDetailsModule).toBeDefined();
  });
});
