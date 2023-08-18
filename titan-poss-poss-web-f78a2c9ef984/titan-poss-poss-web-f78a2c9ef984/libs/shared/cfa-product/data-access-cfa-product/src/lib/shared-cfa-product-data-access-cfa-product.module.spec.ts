import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCfaProductDataAccessCfaProductModule } from './shared-cfa-product-data-access-cfa-product.module';

describe('SharedCfaProductDataAccessCfaProductModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCfaProductDataAccessCfaProductModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCfaProductDataAccessCfaProductModule).toBeDefined();
  });
});
