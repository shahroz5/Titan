import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossTepExceptionConfigDataAccessTepExceptionConfigModule } from './eposs-tep-exception-config-data-access-tep-exception-config.module';

describe('EpossTepExceptionConfigDataAccessTepExceptionConfigModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossTepExceptionConfigDataAccessTepExceptionConfigModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossTepExceptionConfigDataAccessTepExceptionConfigModule
    ).toBeDefined();
  });
});
