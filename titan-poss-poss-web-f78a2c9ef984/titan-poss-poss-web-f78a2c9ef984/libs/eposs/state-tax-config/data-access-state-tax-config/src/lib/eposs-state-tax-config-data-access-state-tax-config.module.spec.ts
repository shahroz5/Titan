import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossStateTaxConfigDataAccessStateTaxConfigModule } from './eposs-state-tax-config-data-access-state-tax-config.module';

describe('SharedCpgQcgcMapDataAccessCpgQcgcMapModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossStateTaxConfigDataAccessStateTaxConfigModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossStateTaxConfigDataAccessStateTaxConfigModule).toBeDefined();
  });
});
