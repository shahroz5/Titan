import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as ItemDetailsPopupActions from './item-details-popup.actions';
import { ItemDetailsPopupState } from './item-details-popup.state';
import { ItemDetailsPopupSelectors } from './item-details-popup.selectors';

@Injectable()
export class ItemDetailsPopupFacade {
  private stoneDetails$ = this.store.select(
    ItemDetailsPopupSelectors.selectStoneDetails
  );
  private isLoading$ = this.store.select(
    ItemDetailsPopupSelectors.selectIsLoading
  );

  private error$ = this.store.select(ItemDetailsPopupSelectors.selectError);

  private pcDesc$ = this.store.select(ItemDetailsPopupSelectors.selectPcDesc);

  private pgDesc$ = this.store.select(ItemDetailsPopupSelectors.selectPgDesc);

  private isDescLoaded$ = this.store.select(
    ItemDetailsPopupSelectors.selectIsDescLoaded
  );

  private COStoneDetails$ = this.store.select(
    ItemDetailsPopupSelectors.selectCOStoneDetails
  );

  constructor(private store: Store<ItemDetailsPopupState>) {}

  /**
   * Access for the State selectors
   */
  getStoneDetails() {
    return this.stoneDetails$;
  }

  getCOStoneDetails() {
    return this.COStoneDetails$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getError() {
    return this.error$;
  }

  getPcDesc() {
    return this.pcDesc$;
  }

  getPgDesc() {
    return this.pgDesc$;
  }

  getIsDescLoaded() {
    return this.isDescLoaded$;
  }

  loadStoneDetails(itemData: {
    itemCode: string;
    lotNumber: string | number;
    locationCode?: string;
  }) {
    this.store.dispatch(new ItemDetailsPopupActions.LoadStoneDetails(itemData));
  }

  loadCOStoneDetails(itemData: { itemCode: string }) {
    this.store.dispatch(
      new ItemDetailsPopupActions.LoadCOStoneDetails(itemData)
    );
  }

  loadPcDesc() {
    this.store.dispatch(new ItemDetailsPopupActions.LoadPcDesc());
  }

  loadPgDesc() {
    this.store.dispatch(new ItemDetailsPopupActions.LoadPgDesc());
  }

  clear() {
    this.store.dispatch(new ItemDetailsPopupActions.Clear());
  }
}
