import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossConversionFeatureConversionDetailsModule } from './eposs-conversion-feature-conversion-details.module';

describe('EpossConversionFeatureConversionDetailsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossConversionFeatureConversionDetailsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossConversionFeatureConversionDetailsModule).toBeDefined();
  });
});
