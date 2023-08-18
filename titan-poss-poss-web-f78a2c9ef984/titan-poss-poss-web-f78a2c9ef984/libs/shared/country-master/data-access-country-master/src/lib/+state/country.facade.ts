import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as countryActions from './country.action';
import { CountrySelectors } from './country.selectors';
import { CountryState } from './country.state';
import {
  LoadCountryListingPayload,
  SaveCountryFormDetailsPayload
} from '@poss-web/shared/models';

@Injectable()
export class CountryFacade {
  constructor(private store: Store<CountryState>) {}

  private countryListing$ = this.store.select(
    CountrySelectors.selectCountryDetailsListing
  );

  private CountryDetailsByCountryCode$ = this.store.select(
    CountrySelectors.selectCountryDetailsByCountryCode
  );

  private isLoading$ = this.store.select(CountrySelectors.selectIsLoading);

  private isCountrySaved$ = this.store.select(
    CountrySelectors.selectSaveCountryFormResponse
  );

  private isCountryEdited$ = this.store.select(
    CountrySelectors.selectEditCountryFormResponse
  );

  private totalCountryDetails$ = this.store.select(
    CountrySelectors.selectTotalCountryDetailsCount
  );

  private hasError$ = this.store.select(CountrySelectors.selectError);
  // private countryName$ = this.store.select(CountrySelectors.selectCountryName);
  private currencyCode$ = this.store.select(
    CountrySelectors.selectCurrencyCode
  );
  private timeFormats$ = this.store.select(CountrySelectors.selectTimeFormats);

  private dateFormats$ = this.store.select(CountrySelectors.selectDateFormats);

  getCountrySaveResponse() {
    return this.isCountrySaved$;
  }

  getCountryEditResponse() {
    return this.isCountryEdited$;
  }

  getisLoading() {
    return this.isLoading$;
  }

  getTotalCountryDetails() {
    return this.totalCountryDetails$;
  }

  getCountryDetailsListing() {
    return this.countryListing$;
  }

  getCountryDetailsByCountryCode() {
    return this.CountryDetailsByCountryCode$;
  }

  getError() {
    return this.hasError$;
  }
  // getCountryName() {
  //   return this.countryName$;
  // }
  getCurrencyCode() {
    return this.currencyCode$;
  }

  getTimeFormats() {
    return this.timeFormats$;
  }
  getDateFormats() {
    return this.dateFormats$;
  }
  loadCountryDetailsByCountryCode(binGroup: string) {
    this.store.dispatch(new countryActions.LoadCountryByCountryCode(binGroup));
  }

  loadCountryDetailsListing(listingPayload: LoadCountryListingPayload) {
    this.store.dispatch(new countryActions.LoadCountryDetails(listingPayload));
  }

  resetCountryDialogData() {
    this.store.dispatch(new countryActions.ResetCountryDialog());
  }

  editCountryFormDetails(editFormDetails: SaveCountryFormDetailsPayload) {
    this.store.dispatch(
      new countryActions.EditCountryFormDetails(editFormDetails)
    );
  }

  saveCountryFormDetails(saveFormDetails: SaveCountryFormDetailsPayload) {
    this.store.dispatch(
      new countryActions.SaveCountryFormDetails(saveFormDetails)
    );
  }

  searchCountry(countryCode: string) {
    this.store.dispatch(new countryActions.SearchCountryCode(countryCode));
  }
  // loadCountryName() {
  //   this.store.dispatch(new countryActions.LoadCountryName());
  // }

  loadCurrencyCode() {
    this.store.dispatch(new countryActions.LoadCurrencyCode());
  }
  loadTimeFormats() {
    this.store.dispatch(new countryActions.LoadTimeFormats());
  }
  loadDateFormats() {
    this.store.dispatch(new countryActions.LoadDateFormats());
  }
}
