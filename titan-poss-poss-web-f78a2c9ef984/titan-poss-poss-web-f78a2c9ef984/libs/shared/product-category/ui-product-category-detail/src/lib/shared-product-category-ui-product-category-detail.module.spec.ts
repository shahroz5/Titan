import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedProductCategoryUiProductCategoryDetailModule } from './shared-product-category-ui-product-category-detail.module';

describe('SharedProductCategoryUiProductCategoryDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedProductCategoryUiProductCategoryDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedProductCategoryUiProductCategoryDetailModule).toBeDefined();
  });
});
