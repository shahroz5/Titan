import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { EpossConversionConfigDataAccessConversionConfigModule } from './eposs-conversion-config-data-access-conversion-config.module';

describe('EpossConversionConfigDataAccessConversionConfigModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossConversionConfigDataAccessConversionConfigModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossConversionConfigDataAccessConversionConfigModule).toBeDefined();
  });
});
