import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossConversionConfigUiConversionConfigItemListModule } from './eposs-conversion-config-ui-conversion-config-item-list.module';

describe('EpossConversionConfigUiConversionConfigItemListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossConversionConfigUiConversionConfigItemListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossConversionConfigUiConversionConfigItemListModule).toBeDefined();
  });
});
