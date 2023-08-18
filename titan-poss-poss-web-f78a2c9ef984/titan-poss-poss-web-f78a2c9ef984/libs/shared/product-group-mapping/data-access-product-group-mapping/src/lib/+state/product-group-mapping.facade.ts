import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ProductGroupMappingState } from './product-group-mapping.state';
import { ProductGroupMappingSelectors } from './product-group-mapping.selector';
import * as ProductGroupActions from './product-group-mapping.actions';
@Injectable()
export class ProductGroupMappingFacade {
  constructor(private store: Store<ProductGroupMappingState>) {}

  private productGroups$ = this.store.select(
    ProductGroupMappingSelectors.selectProductGroups
  );

  private error$ = this.store.select(ProductGroupMappingSelectors.selectError);

  private isLoading$ = this.store.select(
    ProductGroupMappingSelectors.selectIsloading
  );

  getError() {
    return this.error$;
  }

  getProductGroups() {
    return this.productGroups$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  loadProductGroups(filterType?: string) {
    this.store.dispatch(
      new ProductGroupActions.LoadProductGroupMapping(filterType)
    );
  }
  loadReset() {
    this.store.dispatch(new ProductGroupActions.LoadReset());
  }
}
