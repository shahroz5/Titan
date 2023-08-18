import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as MarketCodeActions from './market-code.actions';
import { MarketCodesSelectors } from './market-code.selectors';
import {
  LoadMarketCodesListingPayload,
  SaveMarketCodeDetailsPayload,
  UpdateMarketCodeDetailsPayload,
  SaveMarketMaterialFactorsPayload
} from '@poss-web/shared/models';
import { MarketCodeState } from './market-code.state';
@Injectable()
export class MarketCodeFacade {
  constructor(private store: Store<MarketCodeState>) {}
  private marketCodesListing$ = this.store.select(
    MarketCodesSelectors.selectMarketCodeListing
  );
  private totalMarketCodes$ = this.store.select(
    MarketCodesSelectors.selectTotalMarketCodes
  );
  private marketCodeDetails$ = this.store.select(
    MarketCodesSelectors.selectMarketCodeDetails
  );
  private hasError$ = this.store.select(MarketCodesSelectors.selectError);
  private isLoading$ = this.store.select(MarketCodesSelectors.selectIsLoading);
  private hasSavedMarketCodeDetails$ = this.store.select(
    MarketCodesSelectors.selectHasSavedMarketCodeDetails
  );
  private hasUpdatedMarketCodeDetails$ = this.store.select(
    MarketCodesSelectors.selectHasUpdatedMarketCodeDetails
  );
  private hasUpdatedMarketMaterialFacators$ = this.store.select(
    MarketCodesSelectors.selectHasUpdatedMarketMaterialFacators
  );
  private hassavedMarketMaterialFacators$ = this.store.select(
    MarketCodesSelectors.selectHasSavedMarketMaterialFacators
  );
  private hasStatusUpdate$ = this.store.select(
    MarketCodesSelectors.selectHasStatusUpdate
  );

  loadMarketCodesLisitng(
    loadMarketCodesPayload: LoadMarketCodesListingPayload
  ) {
    this.store.dispatch(
      new MarketCodeActions.LoadMarketCodeDetails(loadMarketCodesPayload)
    );
  }
  loadMarketDetailsBasedOnMarketCode(marketCode: string) {
    this.store.dispatch(
      new MarketCodeActions.LoadMarketCodeDetailsBasedOnMarketCode(marketCode)
    );
  }
  resetMarketCodeDetails() {
    this.store.dispatch(new MarketCodeActions.ResetMarketCodeDetails());
  }
  searchMarketCode(searchValue: string) {
    this.store.dispatch(new MarketCodeActions.SearchMarketCode(searchValue));
  }
  saveMarketCodeDetails(saveForm: SaveMarketCodeDetailsPayload) {
    this.store.dispatch(new MarketCodeActions.SaveMarketCodeDetails(saveForm));
  }
  saveMarketMaterialFacators(
    saveMarketMaterialFactors: SaveMarketMaterialFactorsPayload
  ) {
    this.store.dispatch(
      new MarketCodeActions.SaveMarketMaterialFactors(saveMarketMaterialFactors)
    );
  }
  updateMarketCodeDetails(updateForm: UpdateMarketCodeDetailsPayload) {
    this.store.dispatch(
      new MarketCodeActions.UpdateMarketCodeDetails(updateForm)
    );
  }
  updateMarketMaterialFactors(updateForm: SaveMarketMaterialFactorsPayload) {
    this.store.dispatch(
      new MarketCodeActions.UpdateMarketMaterialFactors(updateForm)
    );
  }
  updateToggleButton(updateToggleButton: UpdateMarketCodeDetailsPayload) {
    this.store.dispatch(
      new MarketCodeActions.UpdateToggleButton(updateToggleButton)
    );
  }

  getMarketCodes() {
    return this.marketCodesListing$;
  }
  getTotalMarketCodesCount() {
    return this.totalMarketCodes$;
  }
  getMarketCodeDetailsBasedOnMarketCode() {
    return this.marketCodeDetails$;
  }
  getError() {
    return this.hasError$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getHasSavedMarketCodeDetails() {
    return this.hasSavedMarketCodeDetails$;
  }
  getHasUpdatedMarketCodeDetails() {
    return this.hasUpdatedMarketCodeDetails$;
  }
  getHasUpdatedMarketMaterialFacators() {
    return this.hasUpdatedMarketMaterialFacators$;
  }
  getSavedMarketMaterialFacators() {
    return this.hassavedMarketMaterialFacators$;
  }
  getHasStatusUpdate() {
    return this.hasStatusUpdate$;
  }
}
