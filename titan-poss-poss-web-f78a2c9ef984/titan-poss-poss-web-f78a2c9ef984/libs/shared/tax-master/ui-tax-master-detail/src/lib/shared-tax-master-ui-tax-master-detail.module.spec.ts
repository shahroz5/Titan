import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedTaxMasterUiTaxMasterDetailModule } from './shared-tax-master-ui-tax-master-detail.module';

describe('SharedTaxMasterUiTaxMasterDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedTaxMasterUiTaxMasterDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedTaxMasterUiTaxMasterDetailModule).toBeDefined();
  });
});
