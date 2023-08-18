import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedTaxClassUiTaxClassListModule } from './shared-tax-class-ui-tax-class-list.module';

describe('SharedTaxClassUiTaxClassListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedTaxClassUiTaxClassListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedTaxClassUiTaxClassListModule).toBeDefined();
  });
});
