import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EncircleProductGroupMappingState } from './encircle-product-group-mapping.state';
import * as EncircleProductGroupMappingActions from './encircle-product-group-mapping.actions';
import { EncircleProductGroupMappingSelectors } from './encircle-product-group-mapping.selector';
import { EncircleProductGroupMappingSavePayload } from '@poss-web/shared/models';
@Injectable()
export class EncircleProductGroupMappingFacade {
  constructor(public store: Store<EncircleProductGroupMappingState>) {}

  selectError$ = this.store.select(
    EncircleProductGroupMappingSelectors.selectError
  );
  selectIsLoading$ = this.store.select(
    EncircleProductGroupMappingSelectors.selectIsLoading
  );
  selectSelectedProductGroups = this.store.select(
    EncircleProductGroupMappingSelectors.selectSelectedProductGroups
  );
  selectHasSaved$ = this.store.select(
    EncircleProductGroupMappingSelectors.selectHasSaved
  );
  selectHasRemoved$ = this.store.select(
    EncircleProductGroupMappingSelectors.selectHasRemoved
  );
  selectProductGroups$ = this.store.select(
    EncircleProductGroupMappingSelectors.selectProductGroups
  );
  selectTotalElements$ = this.store.select(
    EncircleProductGroupMappingSelectors.selectTotalElements
  );
  selectAllSelectedProductGroups$ = this.store.select(
    EncircleProductGroupMappingSelectors.selectAllSelectedProductGroups
  );

  getIsLoading() {
    return this.selectIsLoading$;
  }
  getError() {
    return this.selectError$;
  }
  getSelectedProductGroups() {
    return this.selectSelectedProductGroups;
  }
  getHasSaved() {
    return this.selectHasSaved$;
  }
  getHasRemoved() {
    return this.selectHasRemoved$;
  }
  getProductGroups() {
    return this.selectProductGroups$;
  }
  getTotalElements() {
    return this.selectTotalElements$;
  }
  getAllSelectedProductGroups() {
    return this.selectAllSelectedProductGroups$;
  }
  loadSelectedProductGroups(payload: {
    paymentMode: string;
    pageIndex: number;
    pageSize: number;
    description?: string;
  }) {
    this.store.dispatch(
      new EncircleProductGroupMappingActions.LoadSelectedProductGroups(payload)
    );
  }
  saveProductGroups(savePayload: EncircleProductGroupMappingSavePayload) {
    this.store.dispatch(
      new EncircleProductGroupMappingActions.SaveEncircleProdcutGroups(
        savePayload
      )
    );
  }
  removeProductGroups(removePayload: EncircleProductGroupMappingSavePayload) {
    this.store.dispatch(
      new EncircleProductGroupMappingActions.RemoveEncircleProdcutGroups(
        removePayload
      )
    );
  }

  resetProductGroups() {
    this.store.dispatch(
      new EncircleProductGroupMappingActions.ResetProductGroups()
    );
  }
  loadProductGroups() {
    this.store.dispatch(
      new EncircleProductGroupMappingActions.LoadProductGroups()
    );
  }
  searchProductGroupCode(searchValue: string) {
    this.store.dispatch(
      new EncircleProductGroupMappingActions.SearchProductGroupCode(searchValue)
    );
  }
  loadAllSelectedProductGroups(payload: {
    paymentMode: string;
    pageIndex: number;
    pageSize: number;
  }) {
    this.store.dispatch(
      new EncircleProductGroupMappingActions.LoadAllSelectedProductGroups(
        payload
      )
    );
  }
}
