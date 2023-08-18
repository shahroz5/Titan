import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedProductCategoryDataAccessProductCategoryModule } from './shared-product-category-data-access-product-category.module';

describe('SharedProductCategoryDataAccessProductCategoryModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedProductCategoryDataAccessProductCategoryModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedProductCategoryDataAccessProductCategoryModule).toBeDefined();
  });
});
