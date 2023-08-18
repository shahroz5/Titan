import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossConversionUiConversionItemModule } from './eposs-conversion-ui-conversion-item.module';

describe('EpossConversionUiConversionItemModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossConversionUiConversionItemModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossConversionUiConversionItemModule).toBeDefined();
  });
});
