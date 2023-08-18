import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedTaxClassDataAccessTaxClassModule } from './shared-tax-class-data-access-tax-class.module';

describe('SharedTaxClassDataAccessTaxClassModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedTaxClassDataAccessTaxClassModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedTaxClassDataAccessTaxClassModule).toBeDefined();
  });
});
