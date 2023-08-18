import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossConversionUiConversionRequestPopupModule } from './eposs-conversion-ui-conversion-request-popup.module';

describe('EpossConversionUiConversionRequestPopupModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossConversionUiConversionRequestPopupModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossConversionUiConversionRequestPopupModule).toBeDefined();
  });
});
