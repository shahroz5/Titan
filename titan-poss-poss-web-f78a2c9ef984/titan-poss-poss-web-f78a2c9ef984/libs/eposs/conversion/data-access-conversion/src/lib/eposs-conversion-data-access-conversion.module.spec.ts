import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossConversionDataAccessConversionModule } from './eposs-conversion-data-access-conversion.module';

describe('EpossConversionDataAccessConversionModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossConversionDataAccessConversionModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossConversionDataAccessConversionModule).toBeDefined();
  });
});
