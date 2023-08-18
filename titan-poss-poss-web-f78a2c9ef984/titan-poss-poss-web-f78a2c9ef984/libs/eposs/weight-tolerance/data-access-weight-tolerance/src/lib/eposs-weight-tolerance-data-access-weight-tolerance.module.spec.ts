import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossWeightToleranceDataAccessWeightToleranceModule } from './eposs-weight-tolerance-data-access-weight-tolerance.module';

describe('EpossWeightToleranceDataAccessWeightToleranceModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossWeightToleranceDataAccessWeightToleranceModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossWeightToleranceDataAccessWeightToleranceModule).toBeDefined();
  });
});
