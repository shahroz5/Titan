import { Injectable } from '@angular/core';
import { CorporateTownSelectors } from './corporate-town.selectors';
import * as CorporateTownActions from './corporate-town.actions';

import {
  LoadCorporateTownListingPayload,
  SaveTownFormDetailsPayload
} from '@poss-web/shared/models';
import { CorporateTownState } from './corporate-town.state';

import { Store } from '@ngrx/store';

@Injectable()
export class CorporateTownFacade {
  constructor(private store: Store<CorporateTownState>) {}

  private corporateTownListing$ = this.store.select(
    CorporateTownSelectors.selectLoadedCorporateListing
  );
  private totalCorporateTown$ = this.store.select(
    CorporateTownSelectors.selectTotalCorporateTownDetailsCount
  );

  private stateListing$ = this.store.select(
    CorporateTownSelectors.selectStateDetails
  );

  // private regionListing$ = this.store.select(
  //   CorporateTownSelectors.selectRegionDetails
  // );

  private isCorporateTownLoading$ = this.store.select(
    CorporateTownSelectors.selectIsCorporateTownListingLoading
  );

  private townDetailsByTownCode$ = this.store.select(
    CorporateTownSelectors.selectTownDetailsByTownCode
  );

  private isTownDetailsSaved$ = this.store.select(
    CorporateTownSelectors.selectSaveTownDetailsFormResponse
  );

  private isTownDetailsEdited$ = this.store.select(
    CorporateTownSelectors.selectEditTownDetailsFormResponse
  );

  private corporateError$ = this.store.select(
    CorporateTownSelectors.selectError
  );

  private isSearchElements$ = this.store.select(
    CorporateTownSelectors.selectIssearchElements
  );
  // private countryCodeData$ = this.store.select(
  //   CorporateTownSelectors.selectCountryCode
  // );
  getCorporateTownDetailsListing() {
    return this.corporateTownListing$;
  }

  getTotalCorporateTownDetails() {
    return this.totalCorporateTown$;
  }

  getStateDetailsListing() {
    return this.stateListing$;
  }

  // getRegionDetailsListing() {
  //   return this.regionListing$;
  // }

  getisCorporateTownListingLoading() {
    return this.isCorporateTownLoading$;
  }

  getTownDetailsByTownCode() {
    return this.townDetailsByTownCode$;
  }

  getTownDetailsSaveResponse() {
    return this.isTownDetailsSaved$;
  }

  getTownDetailsEditResponse() {
    return this.isTownDetailsEdited$;
  }
  // getCountryCodeData() {
  //   return this.countryCodeData$;
  // }
  getError() {
    return this.corporateError$;
  }

  getIsSerchElements() {
    return this.isSearchElements$;
  }

  resetTownDialogData() {
    this.store.dispatch(new CorporateTownActions.ResetTownDialog());
  }

  loadCorporateTownListing(
    loadCorporateTownListingPayload: LoadCorporateTownListingPayload
  ) {
    this.store.dispatch(
      new CorporateTownActions.LoadCorporateTownDetails(
        loadCorporateTownListingPayload
      )
    );
  }

  loadStateListing(countryCode: string) {
    this.store.dispatch(new CorporateTownActions.LoadStateDetails(countryCode));
  }

  // loadRegionListing(loadRegionListingPayload: LoadCorporateTownListingPayload) {
  //   this.store.dispatch(
  //     new CorporateTownActions.LoadRegionDetails(loadRegionListingPayload)
  //   );
  // }

  loadTownDetailsByTownCode(townCode: string) {
    this.store.dispatch(
      new CorporateTownActions.LoadTownDetailsByTownCode(townCode)
    );
  }

  saveTownFormDetails(saveFormDetails: SaveTownFormDetailsPayload) {
    this.store.dispatch(
      new CorporateTownActions.SaveTownFormDetails(saveFormDetails)
    );
  }

  editTownFormDetails(saveFormDetails) {
    this.store.dispatch(
      new CorporateTownActions.EditTownFormDetails(saveFormDetails)
    );
  }

  searchCorporateTown(corporateTown: string) {
    this.store.dispatch(
      new CorporateTownActions.SearchCorporateTownCode(corporateTown)
    );
  }
  // loadCountryCode(countryName: string) {
  //   this.store.dispatch(
  //     new CorporateTownActions.LoadCountryDetails(countryName)
  //   );
  // }
}
