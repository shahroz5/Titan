import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossConversionConfigFeatureConversionConfigDetailsModule } from './eposs-conversion-config-feature-conversion-config-details.module';

describe('EpossConversionConfigFeatureConversionConfigDetailsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossConversionConfigFeatureConversionConfigDetailsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossConversionConfigFeatureConversionConfigDetailsModule
    ).toBeDefined();
  });
});
