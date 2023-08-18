import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LoadCurrencyListingPayload,
  LoadCurrencyListingSuccessPayload,
  SaveCurrencyDetailFormPayload,
  EditCurrencyDetailFormPayload,
  CurrencyDetails
} from '@poss-web/shared/models';
import {
  getCurrencyListingUrl,
  // getLoadCountryUrl,
  // getLoadCurrencySymbolUrl,
  // getLoadUnicodeUrl,
  ApiService,
  getCurrencyDetailsByCurrencyCodeUrl,
  getSaveCurrencyFormDetailsUrl
} from '@poss-web/shared/util-api-service';

import { CurrencyAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class CurrencyService {
  constructor(private apiService: ApiService) {}

  getCurrencyDetails(
    loadCurrencyListingPayload: LoadCurrencyListingPayload
  ): Observable<LoadCurrencyListingSuccessPayload> {
    const url = getCurrencyListingUrl(
      loadCurrencyListingPayload.pageIndex,
      loadCurrencyListingPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CurrencyAdaptor.getCurrencyDetailsListing(data)));
  }
  getCurrencyDetailsByCurrencyCode(
    currencyCode: string
  ): Observable<CurrencyDetails> {
    const url = getCurrencyDetailsByCurrencyCodeUrl(currencyCode);
    return this.apiService
      .get(url)
      .pipe(map(data => CurrencyAdaptor.getCurrencyDetailsBasedOnCode(data)));
  }

  getCurrencyDetailsSearch(
    currencyCode: string
  ): Observable<CurrencyDetails[]> {
    const url = getCurrencyDetailsByCurrencyCodeUrl(currencyCode);
    return this.apiService
      .get(url)
      .pipe(map(data => CurrencyAdaptor.getCurrencyDetailsSearch(data)));
  }

  saveCurrencyFormDetails(
    saveForm: SaveCurrencyDetailFormPayload
  ): Observable<CurrencyDetails> {
    const savePost = {
      currencyCode: saveForm.currencyCode,
      currencySymbol: saveForm.currencySymbol,
      description: saveForm.description,
      isActive: saveForm.isActive
    };
    const url = getSaveCurrencyFormDetailsUrl();
    return this.apiService
      .post(url, savePost)
      .pipe(map(data => CurrencyAdaptor.getCurrencyDetailsBasedOnCode(data)));
  }

  editCurrencyFormDetails(
    editedForm: EditCurrencyDetailFormPayload
  ): Observable<CurrencyDetails> {
    const editPost = {
      currencyCode: editedForm.currencyCode,
      currencySymbol: editedForm.currencySymbol,
      description: editedForm.description,
      isActive: editedForm.isActive
    };
    const url = getCurrencyDetailsByCurrencyCodeUrl(editedForm.currencyCode);
    return this.apiService
      .patch(url, editPost)
      .pipe(map(data => CurrencyAdaptor.getCurrencyDetailsBasedOnCode(data)));
  }
}
