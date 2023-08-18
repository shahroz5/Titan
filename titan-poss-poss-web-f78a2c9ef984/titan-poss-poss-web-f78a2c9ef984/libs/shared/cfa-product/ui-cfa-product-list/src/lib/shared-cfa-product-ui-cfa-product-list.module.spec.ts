import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCfaProductUiCfaProductListModule } from './shared-cfa-product-ui-cfa-product-list.module';

describe('SharedCfaProductUiCfaProductListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCfaProductUiCfaProductListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCfaProductUiCfaProductListModule).toBeDefined();
  });
});
