import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedProductCategoryUiProductCategoryListModule } from './shared-product-category-ui-product-category-list.module';

describe('SharedProductCategoryUiProductCategoryListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedProductCategoryUiProductCategoryListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedProductCategoryUiProductCategoryListModule).toBeDefined();
  });
});
