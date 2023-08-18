import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { StateSelectors } from './state.selectors';
import * as StateActions from './state.actions';
import { StatesState } from './state.state';
import {
  LoadStateListingPayload,
} from '@poss-web/shared/models';

@Injectable()
export class StateFacade {
  constructor(private store: Store<StatesState>) {}

  private stateListing$ = this.store.select(
    StateSelectors.selectLoadedStatesListing
  );

  private countryListing$ = this.store.select(
    StateSelectors.selectLoadedCountryListing
  );

  private totalStateDetails$ = this.store.select(
    StateSelectors.selectTotalStateDetailsCount
  );

  private isStateLoading$ = this.store.select(
    StateSelectors.selectIsStateListingLoading
  );

  private stateDetailsStateCode$ = this.store.select(
    StateSelectors.selectStateByStateCode
  );

  private isStateDetailsSaved$ = this.store.select(
    StateSelectors.selectSaveStateDetailsResponse
  );

  private isStateDetailsEdited$ = this.store.select(
    StateSelectors.selectEditStateDetailsResponse
  );

  private stateError$ = this.store.select(StateSelectors.selectError);

  private isSearchElements$ = this.store.select(
    StateSelectors.selectIssearchElements
  );

  private isActiveToggle$ = this.store.select(
    StateSelectors.selectIsActiveToggle
  );
  getStateDetailsListing() {
    return this.stateListing$;
  }

  getCountryDetailsListing() {
    return this.countryListing$;
  }

  getTotalStateDetails() {
    return this.totalStateDetails$;
  }

  getIsStateListingLoading() {
    return this.isStateLoading$;
  }

  getStateByStateCode() {
    return this.stateDetailsStateCode$;
  }

  getStateDetailsSaveResponse() {
    return this.isStateDetailsSaved$;
  }

  getStateDetailsEditResponse() {
    return this.isStateDetailsEdited$;
  }

  getIsActiveToggle() {
    return this.isActiveToggle$;
  }
  getError() {
    return this.stateError$;
  }

  getIsSerchElements() {
    return this.isSearchElements$;
  }

  resetStateDialogData() {
    this.store.dispatch(new StateActions.ResetStateDialog());
  }
  updateIsactive(upadateIsActivePayload: any) {
    this.store.dispatch(
      new StateActions.UpdateIsActive(upadateIsActivePayload)
    );
  }
  loadStateDetailsListing(regionListingPayload: LoadStateListingPayload) {
    this.store.dispatch(
      new StateActions.LoadStateDetails(regionListingPayload)
    );
  }

  loadCountriesListing() {
    this.store.dispatch(new StateActions.LoadCountryDetails());
  }

  loadStateByStateCode(stateId: string) {
    this.store.dispatch(new StateActions.LoadStateByCode(stateId));
  }

  saveStateFormDetails(saveFormDetails: any) {
    this.store.dispatch(new StateActions.SaveStateFormDetails(saveFormDetails));
  }

  editStateFormDetails(editFormDetails: any) {
    this.store.dispatch(new StateActions.EditStateDetails(editFormDetails));
  }

  searchState(regionCode: string) {
    this.store.dispatch(new StateActions.SearchState(regionCode));
  }
}
