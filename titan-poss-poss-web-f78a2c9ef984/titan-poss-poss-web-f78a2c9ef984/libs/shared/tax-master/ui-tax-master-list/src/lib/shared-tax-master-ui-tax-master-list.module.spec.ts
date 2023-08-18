import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedTaxMasterUiTaxMasterListModule } from './shared-tax-master-ui-tax-master-list.module';

describe('SharedTaxMasterUiTaxMasterListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedTaxMasterUiTaxMasterListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedTaxMasterUiTaxMasterListModule).toBeDefined();
  });
});
