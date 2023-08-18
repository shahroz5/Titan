import { Injectable } from '@angular/core';

import { MarketMaterialPriceSelectors } from './market-material-price.selectors';
import * as MarketMaterialPriceActions from './market-material-price.actions';
import {
  MaterialPricePayload,
  ViewLocationPayload,
  SavePricePayload,
  LoadSavedBasePrice,
  LoadMarketBasedOnMaterial,
  SearchSavedLocationPriceByLocationPayload,
  SearchComputedPriceByLocationPayload,
  MarketDetails
} from '@poss-web/shared/models';
import { MarketMaterialPriceState } from './market-material-price.state';

import { Store } from '@ngrx/store';

@Injectable()
export class MarketMaterialPriceFacade {
  constructor(private store: Store<MarketMaterialPriceState>) {}

  private error$ = this.store.select(MarketMaterialPriceSelectors.selectError);

  private metalPriceDetails$ = this.store.select(
    MarketMaterialPriceSelectors.selectMetalPriceDetails
  );
  private marketDetailsBasedOnMaterial$ = this.store.select(
    MarketMaterialPriceSelectors.selectMarketDetailsBasedOnMarket
  );
  private totalElements$ = this.store.select(
    MarketMaterialPriceSelectors.selectTotalCount
  );
  private isLoading$ = this.store.select(
    MarketMaterialPriceSelectors.selectIsLoading
  );

  private locatonDetails$ = this.store.select(
    MarketMaterialPriceSelectors.selectlocationDetails
  );

  private hasNewViewLocationPriceSuccess$ = this.store.select(
    MarketMaterialPriceSelectors.selectHasNewViewLocationPriceSuccess
  );

  private locationDetailsCount$ = this.store.select(
    MarketMaterialPriceSelectors.selcetLocationDetailsCount
  );

  private computedPriceSearchResult$ = this.store.select(
    MarketMaterialPriceSelectors.selectComputedPriceSearchResult
  );

  private computedPriceSearchResultCount$ = this.store.select(
    MarketMaterialPriceSelectors.selcetComputedPriceSearchResultCount
  );
  private selctedDate$ = this.store.select(
    MarketMaterialPriceSelectors.selectDate
  );

  private selctedHasSaved$ = this.store.select(
    MarketMaterialPriceSelectors.selectHasSaved
  );

  private selectSelectedStock$ = this.store.select(
    MarketMaterialPriceSelectors.selctselectedStock
  );

  private hasMarketDetailsBasedOnMaterialLoaded$ = this.store.select(
    MarketMaterialPriceSelectors.selecthasMarketDetailsBasedOnMaterialLoaded
  );

  private allSelected$ = this.store.select(
    MarketMaterialPriceSelectors.selectAllSelected
  );

  private isValueResetToZero$ = this.store.select(
    MarketMaterialPriceSelectors.selectIsValueResetToZero
  );

  private metalTypePriceCount$ = this.store.select(
    MarketMaterialPriceSelectors.materialPriceTotalCount
  );

  getIsValueResetToZero() {
    return this.isValueResetToZero$;
  }
  getAllSelected() {
    return this.allSelected$;
  }
  gethasMarketDetailsBasedOnMaterialLoaded() {
    return this.hasMarketDetailsBasedOnMaterialLoaded$;
  }
  getSelectedStock() {
    return this.selectSelectedStock$;
  }
  getHasSaved() {
    return this.selctedHasSaved$;
  }
  getSelectedDate() {
    return this.selctedDate$;
  }
  getcomputedPriceSearchResultCount() {
    return this.computedPriceSearchResultCount$;
  }
  getComputedPriceSearchResult() {
    return this.computedPriceSearchResult$;
  }

  getLocationDetailsCount() {
    return this.locationDetailsCount$;
  }
  getHasNewViewLocationPriceSuccess() {
    return this.hasNewViewLocationPriceSuccess$;
  }
  getLocationDetails() {
    return this.locatonDetails$;
  }

  getError() {
    return this.error$;
  }
  getIsLoading() {
    return this.isLoading$;
  }

  getMetalPriceDetails() {
    return this.metalPriceDetails$;
  }
  getMarketDetailsBasedOnMaterial() {
    return this.marketDetailsBasedOnMaterial$;
  }
  getTotalMarketCodesCount() {
    return this.totalElements$;
  }

  getMetalPriceTotalCount() {
    return this.metalTypePriceCount$;
  }

  loadMetalPriceDetails(materialPricePayload: MaterialPricePayload) {
    this.store.dispatch(
      new MarketMaterialPriceActions.LoadMetalPriceDetails(materialPricePayload)
    );
  }

  loadMarketDetails(loadMarketBasedOnMaterial: LoadMarketBasedOnMaterial) {
    this.store.dispatch(
      new MarketMaterialPriceActions.LoadMarketDetailsBasedOnMaterial(
        loadMarketBasedOnMaterial
      )
    );
  }

  searchSavedLocationPriceByMarketCode(
    searchSavedLocationPriceByMarketCodePayload: SearchSavedLocationPriceByLocationPayload
  ) {
    this.store.dispatch(
      new MarketMaterialPriceActions.SearchSavedLocationPriceByLocationCode(
        searchSavedLocationPriceByMarketCodePayload
      )
    );
  }
  searchComputedPriceByMarketCode(
    searchComputedPriceByMarketCodePayload: SearchComputedPriceByLocationPayload
  ) {
    this.store.dispatch(
      new MarketMaterialPriceActions.SearchComputedPriceByLocationCode(
        searchComputedPriceByMarketCodePayload
      )
    );
  }
  searchMaterialCode(searchValue) {
    this.store.dispatch(
      new MarketMaterialPriceActions.SearchMarketCode(searchValue)
    );
  }
  loadSavedBasePrice(loadSavedBasePrice: LoadSavedBasePrice) {
    this.store.dispatch(
      new MarketMaterialPriceActions.LoadSavedPrice(loadSavedBasePrice)
    );
  }
  savePrice(savePricePayload: SavePricePayload) {
    this.store.dispatch(
      new MarketMaterialPriceActions.SavePrice(savePricePayload)
    );
  }
  loadLocationPrice(viewLocationPayload: ViewLocationPayload) {
    this.store.dispatch(
      new MarketMaterialPriceActions.ViewLocationPrice(viewLocationPayload)
    );
  }
  computeBasePriceForForcedType(computeBasePrice: any) {
    this.store.dispatch(
      new MarketMaterialPriceActions.ComputeBasePriceForForcedType(
        computeBasePrice
      )
    );
  }

  updateSelectedDate(date: any) {
    this.store.dispatch(
      new MarketMaterialPriceActions.UpdateSelectedDate(date)
    );
  }
  loadReset() {
    this.store.dispatch(new MarketMaterialPriceActions.LoadReset());
  }
  loadResetLocationData() {
    this.store.dispatch(new MarketMaterialPriceActions.LoadResetLocationData());
  }

  loadResetSelectedStock() {
    this.store.dispatch(
      new MarketMaterialPriceActions.LoadResetSelectedStock()
    );
  }
  updateSelectedStock(payload: any) {
    this.store.dispatch(
      new MarketMaterialPriceActions.UpdateSelectedStock(payload)
    );
  }
  updateCheckBox(event) {
    this.store.dispatch(new MarketMaterialPriceActions.UpdateCheckBox(event));
  }
  updateHasNewViewLocationPrice(payload: boolean) {
    this.store.dispatch(
      new MarketMaterialPriceActions.UpdateHasNewViewLocationPrice(payload)
    );
  }

  updateAllSelected(payload) {
    this.store.dispatch(
      new MarketMaterialPriceActions.UpdateAllSelected(payload)
    );
  }
  loadComputePriceForAll(marketDetails: MarketDetails[]) {
    this.store.dispatch(
      new MarketMaterialPriceActions.ComputePriceForAll(marketDetails)
    );
  }
  loadRemovePriceForAll(marketDetails: MarketDetails[], selectedStock: any) {
    this.store.dispatch(
      new MarketMaterialPriceActions.RemovePriceForAll(marketDetails)
    );
  }

  loadIsValueResetZero() {
    this.store.dispatch(
      new MarketMaterialPriceActions.LoadIsValueResetToZero()
    );
  }
}
