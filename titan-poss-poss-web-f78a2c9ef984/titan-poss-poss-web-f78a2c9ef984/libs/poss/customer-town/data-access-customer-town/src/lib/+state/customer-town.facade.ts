import { Injectable } from '@angular/core';
import { CustomerTownSelectors } from './customer-town.selectors';
import * as CustomerTownActions from './customer-town.actions';

import {
  LoadCustomerTownListingPayload,
  CustomerTown,
  SaveTownFormDetailsPayload
} from '@poss-web/shared/models';
import { CustomerTownState } from './customer-town.state';

import { Store } from '@ngrx/store';

@Injectable()
export class CustomerTownFacade {
  constructor(private store: Store<CustomerTownState>) {}

  private corporateTownListing$ = this.store.select(
    CustomerTownSelectors.selectCustomerTownDetailsListing
  );
  private totalCustomerTown$ = this.store.select(
    CustomerTownSelectors.selectTotalCustomerTownDetailsCount
  );

  private stateListing$ = this.store.select(
    CustomerTownSelectors.selectStateDetails
  );

  // private regionListing$ = this.store.select(
  //   CustomerTownSelectors.selectRegionDetails
  // );

  private isCustomerTownLoading$ = this.store.select(
    CustomerTownSelectors.selectIsCustomerTownListingLoading
  );

  private townDetailsByTownCode$ = this.store.select(
    CustomerTownSelectors.selectTownDetailsByTownCode
  );

  private isTownDetailsSaved$ = this.store.select(
    CustomerTownSelectors.selectSaveTownDetailsFormResponse
  );

  private isTownDetailsEdited$ = this.store.select(
    CustomerTownSelectors.selectEditTownDetailsFormResponse
  );

  private corporateError$ = this.store.select(
    CustomerTownSelectors.selectError
  );

  private isSearchElements$ = this.store.select(
    CustomerTownSelectors.selectIssearchElements
  );

  getCustomerTownDetailsListing() {
    return this.corporateTownListing$;
  }

  getTotalCustomerTownDetails() {
    return this.totalCustomerTown$;
  }

  getStateDetailsListing() {
    return this.stateListing$;
  }

  // getRegionDetailsListing() {
  //   return this.regionListing$;
  // }

  getisCustomerTownListingLoading() {
    return this.isCustomerTownLoading$;
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

  getError() {
    return this.corporateError$;
  }

  getIsSerchElements() {
    return this.isSearchElements$;
  }

  resetTownDialogData() {
    this.store.dispatch(new CustomerTownActions.ResetTownDialog());
  }

  loadCustomerTownListing(
    loadCustomerTownListingPayload: LoadCustomerTownListingPayload,
    townName?: string
  ) {
    this.store.dispatch(
      new CustomerTownActions.LoadCustomerTownDetails(
        loadCustomerTownListingPayload,
        townName
      )
    );
  }

  loadStateListing(countryCode: string) {
    this.store.dispatch(new CustomerTownActions.LoadStateDetails(countryCode));
  }

  // loadRegionListing(loadRegionListingPayload: LoadCustomerTownListingPayload) {
  //   this.store.dispatch(
  //     new CustomerTownActions.LoadRegionDetails(loadRegionListingPayload)
  //   );
  // }

  loadTownDetailsByTownCode(townCode: string) {
    this.store.dispatch(
      new CustomerTownActions.LoadTownDetailsByTownCode(townCode)
    );
  }

  saveTownFormDetails(saveFormDetails: SaveTownFormDetailsPayload) {
    this.store.dispatch(
      new CustomerTownActions.SaveTownFormDetails(saveFormDetails)
    );
  }

  editTownFormDetails(saveFormDetails: CustomerTown) {
    this.store.dispatch(
      new CustomerTownActions.EditTownFormDetails(saveFormDetails)
    );
  }

  // searchCustomerTown(corporateTown: string) {
  //   this.store.dispatch(
  //     new CustomerTownActions.SearchCustomerTownCode(corporateTown)
  //   );
  // }
}
