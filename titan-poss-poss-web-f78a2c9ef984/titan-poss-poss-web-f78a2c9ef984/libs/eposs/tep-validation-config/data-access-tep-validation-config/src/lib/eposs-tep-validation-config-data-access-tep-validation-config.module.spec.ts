import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossTepValidationConfigDataAccessTepValidationConfigModule } from './eposs-tep-validation-config-data-access-tep-validation-config.module';

describe('EpossTepValidationConfigDataAccessTepValidationConfigModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossTepValidationConfigDataAccessTepValidationConfigModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossTepValidationConfigDataAccessTepValidationConfigModule
    ).toBeDefined();
  });
});
