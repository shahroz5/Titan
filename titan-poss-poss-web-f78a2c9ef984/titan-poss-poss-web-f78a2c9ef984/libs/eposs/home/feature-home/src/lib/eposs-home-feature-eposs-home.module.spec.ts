import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossHomeFeatureEpossHomeModule } from './eposs-home-feature-eposs-home.module';

describe('EpossHomeFeatureEpossHomeModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossHomeFeatureEpossHomeModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossHomeFeatureEpossHomeModule).toBeDefined();
  });
});
