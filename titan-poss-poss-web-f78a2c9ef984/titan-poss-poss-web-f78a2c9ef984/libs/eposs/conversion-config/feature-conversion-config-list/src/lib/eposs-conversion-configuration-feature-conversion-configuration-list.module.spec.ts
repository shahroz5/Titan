import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossConversionConfigFeatureConversionConfigListModule } from './eposs-conversion-configuration-feature-conversion-configuration-list.module';

describe('EpossConversionConfigurationFeatureConversionConfigurationListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossConversionConfigFeatureConversionConfigListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossConversionConfigFeatureConversionConfigListModule
    ).toBeDefined();
  });
});
