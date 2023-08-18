import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ProductCategoryMappingState } from './pc-mapping.state';
import { ProductCategoryMappingSelectors } from './pc-mapping.selector';
import * as ProductGroupActions from './pc-mapping.actions';
@Injectable()
export class ProductCategoryMappingFacade {
  constructor(private store: Store<ProductCategoryMappingState>) {}

  private productCategory$ = this.store.select(
    ProductCategoryMappingSelectors.selectProductCategory
  );

  private error$ = this.store.select(
    ProductCategoryMappingSelectors.selectError
  );

  private isLoading$ = this.store.select(
    ProductCategoryMappingSelectors.selectIsloading
  );

  getError() {
    return this.error$;
  }

  getProductCategory() {
    return this.productCategory$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  loadProductCategory() {
    this.store.dispatch(new ProductGroupActions.LoadProductCategory());
  }
  loadReset() {
    this.store.dispatch(new ProductGroupActions.LoadReset());
  }
}
