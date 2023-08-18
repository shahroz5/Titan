import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossConversionFeatureConversionModule } from './eposs-conversion-feature-conversion.module';

describe('EpossConversionFeatureConversionModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossConversionFeatureConversionModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossConversionFeatureConversionModule).toBeDefined();
  });
});
