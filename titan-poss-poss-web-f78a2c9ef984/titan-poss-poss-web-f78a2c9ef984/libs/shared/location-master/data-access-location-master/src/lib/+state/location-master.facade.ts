import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { LocationMasterSelectors } from './location-master.selectors';
import { LocationMasterState } from './location-master.state';
import * as LocationMasterActions from './location-master.actions';


import {
  CopyDetailsPayload,
  LocationListingPage, LocationMasterDetails
} from '@poss-web/shared/models';


@Injectable()
export class LocationMasterFacade {
  constructor(private store: Store<LocationMasterState>) { }

  private locationListing$ = this.store.select(
    LocationMasterSelectors.selectLoadedLocationList
  );

  private isLoading$ = this.store.select(
    LocationMasterSelectors.selectIsLoading
  );

  private totalCount$ = this.store.select(
    LocationMasterSelectors.selectTotalCount
  );

  private locationDetails$ = this.store.select(
    LocationMasterSelectors.selectLocationDetails
  );

  // Dropdown
  private towns$ = this.store.select(LocationMasterSelectors.selectTowns);
  private states$ = this.store.select(LocationMasterSelectors.selectStates);
  private ownerInfo$ = this.store.select(LocationMasterSelectors.selectOwnerInfo);
  private regions$ = this.store.select(LocationMasterSelectors.selectRegions);
  private subRegions$ = this.store.select(LocationMasterSelectors.selectSubRegions);
  private brands$ = this.store.select(LocationMasterSelectors.selectBrands);
  private selectSubBrand$ = this.store.select(LocationMasterSelectors.selectSubBrand);
  private marketCode$ = this.store.select(LocationMasterSelectors.selectMarketCode);
  private baseCurrencyTypes$ = this.store.select(LocationMasterSelectors.selectBaseCurrencyTypes);
  private currencyTypes$ = this.store.select(LocationMasterSelectors.selectCurrencyTypes);
  private locationTypes$ = this.store.select(LocationMasterSelectors.selectLocationTypes);
  private locationSize$ = this.store.select(LocationMasterSelectors.selectLocationSize);
  private invoiceType$ = this.store.select(LocationMasterSelectors.selectInvoicetype);
  private refundMode$ = this.store.select(LocationMasterSelectors.selectRefundMode);
  private isSaved$ = this.store.select(LocationMasterSelectors.selectIsSaved);
  private isCopySuccess$ = this.store.select(LocationMasterSelectors.selectIscopySuccess);
  private countryCode$ = this.store.select(LocationMasterSelectors.selectCountryCode);
  private locationCFATypes$ = this.store.select(LocationMasterSelectors.selectLocationCFATypes);

  private error$ = this.store.select(
    LocationMasterSelectors.selectError
  );


  getLocationListing() {
    return this.locationListing$;
  }

  getIsCopySuccess() {
    return this.isCopySuccess$;
  }

  getLocationDetails() {
    return this.locationDetails$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getTotalCount() {
    return this.totalCount$;
  }

  getError() {
    return this.error$;
  }

  // Dropdown
  getTowns() {
    return this.towns$;
  }

  getStates() {
    return this.states$;
  }

  getOwnerInfo() {
    return this.ownerInfo$;
  }

  getRegions() {
    return this.regions$;
  }

  getSubRegions() {
    return this.subRegions$;
  }

  getBrandName() {
    return this.brands$;
  }

  getSubBrand() {
    return this.selectSubBrand$;
  }

  getMarketCode() {
    return this.marketCode$;
  }

  getBaseCurrencyTypes() {
    return this.baseCurrencyTypes$;
  }


  getCurrencyTypes() {
    return this.currencyTypes$;
  }

  getLocationTypes() {
    return this.locationTypes$;
  }

  getLocationSize() {
    return this.locationSize$;
  }

  getInvoiceType() {
    return this.invoiceType$
  }

  getRefundMode() {
    return this.refundMode$;
  }

  getIsSaved() {
    return this.isSaved$;
  }

  getCountryCode() {
    return this.countryCode$;
  }
  getLocationCFATypes() {
    return this.locationCFATypes$;
  }

  loadLocationListing(locationListPayload: LocationListingPage) {
    this.store.dispatch(
      new LocationMasterActions.LoadLocationListing(locationListPayload)
    );
  }

  searchLocation(locationCode: string) {
    this.store.dispatch(
      new LocationMasterActions.SearchLocationByLocationCode(locationCode)
    );
  }

  copyLocationDetails(payload: CopyDetailsPayload) {
    this.store.dispatch(new LocationMasterActions.CopyDetails(payload));
  }

  loadLocationDetails(locationCode: string) {
    this.store.dispatch(
      new LocationMasterActions.LoadLocationDetails(locationCode)
    );
  }

  saveLocationDetails(locationDetails: LocationMasterDetails) {
    this.store.dispatch(
      new LocationMasterActions.SaveLocationDetails(locationDetails)
    );
  }

  updateLocationDetails(locationDetails: LocationMasterDetails) {
    this.store.dispatch(
      new LocationMasterActions.UpdateLocationDetails(locationDetails)
    );
  }

  loadlocationTypes() {
    this.store.dispatch(new LocationMasterActions.LoadLocationTypes());
  }

  loadTowns(stateId?: string) {
    this.store.dispatch(new LocationMasterActions.LoadTowns(stateId));
  }

  loadStates(countryId?: string) {
    this.store.dispatch(new LocationMasterActions.LoadStates(countryId));
  }

  loadOwnerInfo() {
    this.store.dispatch(new LocationMasterActions.LoadOwnerInfo());
  }

  loadRegion() {
    this.store.dispatch(new LocationMasterActions.LoadRegion());
  }

  loadCountryCode() {
    this.store.dispatch(new LocationMasterActions.LoadCountryCode());
  }

  loadSubRegion(parentRegionCode: string) {
    this.store.dispatch(
      new LocationMasterActions.LoadSubRegion(parentRegionCode)
    );
  }

  loadBrands() {
    this.store.dispatch(new LocationMasterActions.LoadBrand());
  }

  loadSubBrand(parentBrandCode: string) {
    this.store.dispatch(
      new LocationMasterActions.LoadSubBrand(parentBrandCode)
    );
  }

  loadMarketCode() {
    this.store.dispatch(new LocationMasterActions.LoadMarketCode());
  }

  loadBaseCurrency() {
    this.store.dispatch(new LocationMasterActions.LoadBaseCurrency());
  }

  loadCurrency() {
    this.store.dispatch(new LocationMasterActions.LoadCurrency());
  }

  loadLocationSize() {
    this.store.dispatch(new LocationMasterActions.LoadLocationSize());
  }

  loadInvoiceType() {
    this.store.dispatch(new LocationMasterActions.LoadInvoiceType());
  }

  loadRefundMode() {
    this.store.dispatch(new LocationMasterActions.LoadRefundMode());
  }

  loadLocationCFATypes() {
    this.store.dispatch(new LocationMasterActions.LoadCFAList());
  }

}
