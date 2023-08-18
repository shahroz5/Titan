import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getCountryDetailsListingUrl,
  getCountryByCountryCodeUrl,
  getCountrySaveFormDetailsUrl,
  // getLoadCountryNameUrl,
  getCurrencyCodeUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadCountryListingPayload,
  LoadCountryListingSuccessPayload,
  CountryDetails,
  SaveCountryFormDetailsPayload,
  CountryMaster
} from '@poss-web/shared/models';
import { CountryAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class CountryService {
  constructor(private apiService: ApiService) {}

  getCountryDetails(
    loadCountryListingPayload: LoadCountryListingPayload
  ): Observable<LoadCountryListingSuccessPayload> {
    const url = getCountryDetailsListingUrl(
      loadCountryListingPayload.pageIndex,
      loadCountryListingPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CountryAdaptor.getCountryDetailsListing(data)));
  }

  getCountryByCountryCode(countryCode: string): Observable<CountryMaster> {
    const url = getCountryByCountryCodeUrl(countryCode);
    return this.apiService
      .get(url)
      .pipe(map(data => CountryAdaptor.getCountryDetailsBasedOnCode(data)));
  }

  getCountrySearchResult(countryName: string): Observable<CountryDetails[]> {
    const url = getCountryDetailsListingUrl(0, 0, countryName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CountryAdaptor.getCountryDetailsSearch(data)));
  }

  saveCountryFormDetails(saveForm: SaveCountryFormDetailsPayload) {
    console.log(saveForm);
    const payload = {
      countryCode: saveForm.countryCode,
      description: saveForm.description,
      currencyCode: saveForm.currencyCode,
      dateFormat: saveForm.dateFormat,
      fiscalYearStart: saveForm.fiscalYearStart
        ? saveForm.fiscalYearStart
        : null,
      isdCode: saveForm.isdCode,
      phoneLength: saveForm.phoneLength,
      locale: saveForm.locale,
      timeFormat: saveForm.timeFormat,
      fiscalYear: saveForm.fiscalYear ? saveForm.fiscalYear : null,
      weightUnit: saveForm.weightUnit,
      stoneWeightUnit: saveForm.stoneWeightUnit,
      isActive: saveForm.isActive
    };
    const url = getCountrySaveFormDetailsUrl();
    return this.apiService.post(url, payload);
  }

  editCountryFormDetails(editedForm: SaveCountryFormDetailsPayload) {
    const payload = {
      countryCode: editedForm.countryCode,
      description: editedForm.description,
      currencyCode: editedForm.currencyCode,
      dateFormat: editedForm.dateFormat,
      fiscalYearStart: editedForm.fiscalYearStart
        ? editedForm.fiscalYearStart
        : null,
      isdCode: editedForm.isdCode,
      phoneLength: editedForm.phoneLength,
      locale: editedForm.locale,
      timeFormat: editedForm.timeFormat,
      fiscalYear: editedForm.fiscalYear ? editedForm.fiscalYear : null,
      weightUnit: editedForm.weightUnit,
      stoneWeightUnit: editedForm.stoneWeightUnit,
      isActive: editedForm.isActive
    };
    const url = getCountryByCountryCodeUrl(editedForm.countryCode);
    return this.apiService.patch(url, payload);
  }

  // getCountryName() {
  //   const url = getLoadCountryNameUrl();
  //   return this.apiService
  //     .get(url.path, url.params)
  //     .pipe(map(data => CountryAdaptor.getCountryName(data)));
  // }
  getCurrencyCode() {
    const url = getCurrencyCodeUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CountryAdaptor.getCurrencyCode(data)));
  }
}
