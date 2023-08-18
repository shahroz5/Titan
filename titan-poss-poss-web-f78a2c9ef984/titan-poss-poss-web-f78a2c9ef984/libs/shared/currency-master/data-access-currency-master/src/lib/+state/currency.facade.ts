import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as currencyActions from './currency.action';
import { CurrencyState } from './currency.state';
import { CurrencySelectors } from './currency.selector';
import {
  LoadCurrencyListingPayload,
  SaveCurrencyDetailFormPayload
} from '@poss-web/shared/models';

@Injectable()
export class CurrencyFacade {
  constructor(private store: Store<CurrencyState>) {}

  private currencyListing$ = this.store.select(
    CurrencySelectors.selectCurrencyDetailsListing
  );
  private currencyDetailsByCurrencyCode$ = this.store.select(
    CurrencySelectors.selectCurrencyDetailsByCurrencyCode
  );
  private isLoading$ = this.store.select(CurrencySelectors.selectIsLoading);
  private isCurrencySaved$ = this.store.select(
    CurrencySelectors.selectSaveCurrencyFormResponse
  );
  private isCurrencyEdited$ = this.store.select(
    CurrencySelectors.selectEditCurrencyFormResponse
  );
  private totalCurrencyDetails$ = this.store.select(
    CurrencySelectors.selectTotalCurrencyDetailsCount
  );
  // private countryDetails$ = this.store.select(
  //   CurrencySelectors.selectCountry
  // );
  // private currencySymbolDetails$ = this.store.select(
  //   CurrencySelectors.selectCurrencySymbol
  // );
  // private unicodeDetails$ = this.store.select(CurrencySelectors.selectUnicode);

  private hasError$ = this.store.select(CurrencySelectors.selectError);

  getCurrencySaveResponse() {
    return this.isCurrencySaved$;
  }
  getCurrencyEditResponse() {
    return this.isCurrencyEdited$;
  }
  getisLoading() {
    return this.isLoading$;
  }
  getTotalCurrencyDetails() {
    return this.totalCurrencyDetails$;
  }

  getCurrencyDetailsListing() {
    return this.currencyListing$;
  }
  getCurrencyDetailsByCurrencyCode() {
    return this.currencyDetailsByCurrencyCode$;
  }
  // getCountryDetails() {
  //   return this.countryDetails$;
  // }
  // getCurrencySymbol() {
  //   return this.currencySymbolDetails$;
  // }
  // getUnicode() {
  //   return this.unicodeDetails$;
  // }
  getError() {
    return this.hasError$;
  }

  loadCurrencyDetailsByCurrencyCode(currencyCode: string) {
    this.store.dispatch(
      new currencyActions.LoadCurrencyDetailsByCurrencyCode(currencyCode)
    );
  }

  loadCurrencyDetailsListing(
    loadCurrencyDetailsListingPayload: LoadCurrencyListingPayload
  ) {
    this.store.dispatch(
      new currencyActions.LoadCurrencyDetails(loadCurrencyDetailsListingPayload)
    );
  }

  // loadCountryDetails() {
  //   this.store.dispatch(new currencyActions.LoadCountry());
  // }

  // loadCurrencySymbol() {
  //   this.store.dispatch(new currencyActions.LoadCurrencySymbol());
  // }
  // loadUnicode() {
  //   this.store.dispatch(new currencyActions.LoadUnicode());
  // }

  resetCurrencyDialogData() {
    this.store.dispatch(new currencyActions.ResetCurrencyDialog());
  }

  editCurrencyFormDetails(editFormDetails: SaveCurrencyDetailFormPayload) {
    this.store.dispatch(
      new currencyActions.EditCurrencyFormDetails(editFormDetails)
    );
  }

  saveCurrencyFormDetails(saveFormDetails: SaveCurrencyDetailFormPayload) {
    this.store.dispatch(
      new currencyActions.SaveCurrencyFormDetails(saveFormDetails)
    );
  }

  searchCurrency(currencyCode: string) {
    this.store.dispatch(new currencyActions.SearchCurrency(currencyCode));
  }
}

