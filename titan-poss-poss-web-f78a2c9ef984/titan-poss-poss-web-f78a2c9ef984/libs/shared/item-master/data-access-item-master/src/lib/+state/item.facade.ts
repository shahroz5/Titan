import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as itemActions from './item.actions';
import { ItemListingState } from './item.state';
import { ItemSelectors } from './item.selectors';
import {
  ItemFilter,
  ItemFilterPayload
} from '@poss-web/shared/models';

@Injectable()
export class ItemFacade {
  constructor(private store: Store<ItemListingState>) {}

  private totalItemDetails$ = this.store.select(
    ItemSelectors.selectTotalItemDetailsCount
  );
  private itemDetailsListing$ = this.store.select(
    ItemSelectors.selectItemDetailsListing
  );
  private itemDetailsByitemCode$ = this.store.select(
    ItemSelectors.selectItemDetailsByItemCode
  );
  private pricingTypes$ = this.store.select(ItemSelectors.selectPricingTypes);
  private CFAproductCodes$ = this.store.select(
    ItemSelectors.selectCFAproductCode
  );
  private isLoading$ = this.store.select(ItemSelectors.selectIsLoading);
  private itemFilter$ = this.store.select(ItemSelectors.selectItemFilter);
  private itemError$ = this.store.select(ItemSelectors.selectError);
  private itemStones$ = this.store.select(ItemSelectors.selectItemStones);
  getisLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.itemError$;
  }
  getTotalitemDetails() {
    return this.totalItemDetails$;
  }

  getitemDetailsListing() {
    return this.itemDetailsListing$;
  }

  getitemDetailsByitemCode() {
    return this.itemDetailsByitemCode$;
  }

  getItemStones() {
    return this.itemStones$;
  }
  getItemFilter() {
    return this.itemFilter$;
  }
  getPricingTypes() {
    return this.pricingTypes$;
  }
  getCFAproductCode() {
    return this.CFAproductCodes$;
  }
  loadItemDetailsByitemCode(item: string) {
    this.store.dispatch(new itemActions.LoadItemByItemCode(item));
  }

  resetItemDetailsByitemCode() {
    this.store.dispatch(new itemActions.ResetItemByItemCode());
  }

  // searchItem(itemCode: string) {
  //   this.store.dispatch(new itemActions.SearchItem(itemCode));
  // }

  loadItemStones(itemCode: string) {
    this.store.dispatch(new itemActions.LoadStones(itemCode));
  }
  loadPricingTypes(lov: string) {
    this.store.dispatch(new itemActions.LoadPricingType(lov));
  }
  loadCFAproductCodes() {
    this.store.dispatch(new itemActions.LoadCFAProductCode());
  }
  loadItemFilter(payload: ItemFilter) {
    this.store.dispatch(new itemActions.LoadFilterItemDetails(payload));
  }
  StoreItemFilter(payload: ItemFilterPayload) {
    this.store.dispatch(new itemActions.StoreFilter(payload));
  }
  loadResetFilter() {
    this.store.dispatch(new itemActions.ResetFilter());
  }
}
