import { Injectable } from '@angular/core';
import { ProductMasterUpdateState } from './product-master-update.state';
import { Store } from '@ngrx/store';
import * as ProductMasterActions from './product-master-update.actions';
import { ProductMasterUpdateSelectors } from './product-master-update.selectors';
import { Observable } from 'rxjs';
import { CustomErrors } from '@poss-web/shared/models';

@Injectable()
export class ProductMasterUpdateFacade {
  constructor(private store: Store<ProductMasterUpdateState>) {}

  private error$ = this.store.select(ProductMasterUpdateSelectors.selectError);

  private isLoading$ = this.store.select(
    ProductMasterUpdateSelectors.selectIsLoading
  );

  private updateResponse$ = this.store.select(
    ProductMasterUpdateSelectors.selectProductMasterUpdateResponse
  );

  loadProductMasterUpdate(itemCode: string, lotNumber: string) {
    this.store.dispatch(
      new ProductMasterActions.LoadProductMasterUpdate(itemCode, lotNumber)
    );
  }

  getUpdateResponse() {
    return this.updateResponse$;
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  getError(): Observable<CustomErrors> {
    return this.error$;
  }
}
