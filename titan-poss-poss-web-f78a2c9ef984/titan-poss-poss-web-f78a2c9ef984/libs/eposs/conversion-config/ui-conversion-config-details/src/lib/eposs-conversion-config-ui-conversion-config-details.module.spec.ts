import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossConversionConfigUiConversionConfigDetailsModule } from './eposs-conversion-config-ui-conversion-config-details.module';

describe('EpossConversionConfigurationUiConversionConfigurationAgGridModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossConversionConfigUiConversionConfigDetailsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossConversionConfigUiConversionConfigDetailsModule).toBeDefined();
  });
});
