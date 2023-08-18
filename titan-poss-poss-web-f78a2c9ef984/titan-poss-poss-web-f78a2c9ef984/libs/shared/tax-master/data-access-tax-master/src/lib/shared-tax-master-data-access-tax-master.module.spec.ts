import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedTaxMasterDataAccessTaxMasterModule } from './shared-tax-master-data-access-tax-master.module';

describe('SharedTaxMasterDataAccessTaxMasterModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedTaxMasterDataAccessTaxMasterModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedTaxMasterDataAccessTaxMasterModule).toBeDefined();
  });
});
