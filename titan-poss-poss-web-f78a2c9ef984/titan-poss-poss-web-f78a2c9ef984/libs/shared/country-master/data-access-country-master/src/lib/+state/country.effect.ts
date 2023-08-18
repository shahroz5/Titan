import { DataPersistence } from '@nrwl/angular';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as CountryActions from './country.action';
import { CountryService } from '../country.service';
import {
  LoadCountryListingSuccessPayload,
  CountryDetails,
  CustomErrors,
  CountryMaster,
  Lov,
  LovMasterEnum,
  CurrencyList
} from '@poss-web/shared/models';
import { NotificationService } from '@poss-web/shared/util-notification';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LovDataService,
  LocationDataService
} from '@poss-web/shared/masters/data-access-masters';

@Injectable()
export class CountryEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private notificationService: NotificationService,
    private countryService: CountryService,
    private locationDataService: LocationDataService,
    private lovService: LovDataService
  ) {}

  @Effect()
  loadCountryDetails$ = this.dataPersistence.fetch(
    CountryActions.CountryActionTypes.LOAD_COUNTRY_LISTING,
    {
      run: (action: CountryActions.LoadCountryDetails) => {
        return this.countryService
          .getCountryDetails(action.payload)
          .pipe(
            map(
              (countryDetails: LoadCountryListingSuccessPayload) =>
                new CountryActions.LoadCountryDetailsSuccess(countryDetails)
            )
          );
      },
      onError: (
        action: CountryActions.LoadCountryDetails,
        error: HttpErrorResponse
      ) => {
        return new CountryActions.LoadCountryDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCountryDetailsByCountryCode$ = this.dataPersistence.fetch(
    CountryActions.CountryActionTypes.LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE,
    {
      run: (action: CountryActions.LoadCountryByCountryCode) => {
        return this.countryService
          .getCountryByCountryCode(action.payload)
          .pipe(
            map(
              (CountryDetailsByCountryCode: CountryMaster) =>
                new CountryActions.LoadCountryByCountryCodeSuccess(
                  CountryDetailsByCountryCode
                )
            )
          );
      },
      onError: (
        action: CountryActions.LoadCountryByCountryCode,
        error: HttpErrorResponse
      ) => {
        return new CountryActions.LoadCountryByCountryCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveCountryFormDetails$ = this.dataPersistence.pessimisticUpdate(
    CountryActions.CountryActionTypes.SAVE_COUNTRY_FORM_DETAILS,
    {
      run: (action: CountryActions.SaveCountryFormDetails) => {
        return this.countryService.saveCountryFormDetails(action.payload).pipe(
          map((saveData: CountryMaster) => {
            return new CountryActions.SaveCountryFormDetailsSuccess(saveData);
          })
        );
      },
      onError: (
        action: CountryActions.SaveCountryFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CountryActions.SaveCountryFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editCountryFormDetails$ = this.dataPersistence.pessimisticUpdate(
    CountryActions.CountryActionTypes.EDIT_COUNTRY_FORM_DETAILS,
    {
      run: (action: CountryActions.EditCountryFormDetails) => {
        return this.countryService.editCountryFormDetails(action.payload).pipe(
          map((saveData: CountryMaster) => {
            return new CountryActions.EditCountryFormDetailsSuccess(saveData);
          })
        );
      },
      onError: (
        action: CountryActions.EditCountryFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CountryActions.EditCountryFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchCountryFormDetails$ = this.dataPersistence.fetch(
    CountryActions.CountryActionTypes.SEARCH_COUNTRY_DETAILS,
    {
      run: (action: CountryActions.SearchCountryCode) => {
        return this.countryService
          .getCountrySearchResult(action.payload)
          .pipe(
            map(
              (SearchResult: CountryDetails[]) =>
                new CountryActions.SearchCountryCodeSuccess(SearchResult)
            )
          );
      },
      onError: (
        action: CountryActions.SearchCountryCode,
        error: HttpErrorResponse
      ) => {
        return new CountryActions.SearchCountryCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // @Effect()
  // countryName$ = this.dataPersistence.fetch(
  //   CountryActions.CountryActionTypes.LOAD_COUNTRY_NAME,
  //   {
  //     run: (action: CountryActions.LoadCountryName) => {
  //       return this.countryService
  //         .getCountryName()
  //         .pipe(
  //           map(
  //             (countryName: CountryNameData[]) =>
  //               new CountryActions.LoadCountryNameSuccess(countryName)
  //           )
  //         );
  //     },
  //     onError: (
  //       action: CountryActions.LoadCountryName,
  //       error: HttpErrorResponse
  //     ) => {
  //       return new CountryActions.LoadCountryNameFailure(
  //         this.errorHandler(error)
  //       );
  //     }
  //   }
  // );

  @Effect()
  currencyCode$ = this.dataPersistence.fetch(
    CountryActions.CountryActionTypes.LOAD_CURRENCY_CODE,
    {
      run: (action: CountryActions.LoadCurrencyCode) => {
        return this.locationDataService
          .getCurrencyList(false)
          .pipe(
            map(
              (currencyCode: CurrencyList[]) =>
                new CountryActions.LoadCurrencyCodeSuccess(currencyCode)
            )
          );
      },
      onError: (
        action: CountryActions.LoadCurrencyCode,
        error: HttpErrorResponse
      ) => {
        return new CountryActions.LoadCurrencyCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTimeFormats$ = this.dataPersistence.fetch(
    CountryActions.CountryActionTypes.LOAD_TIME_FORMATS,
    {
      run: (action: CountryActions.LoadTimeFormats) => {
        return this.lovService
          .getLov(LovMasterEnum.TIMEFORMAT)
          .pipe(
            map(
              (timeFormats: Lov[]) =>
                new CountryActions.LoadTimeFormatsSuccess(timeFormats)
            )
          );
      },
      onError: (
        action: CountryActions.LoadTimeFormats,
        error: HttpErrorResponse
      ) => {
        return new CountryActions.LoadTimeFormatsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  LoadDateFormats$ = this.dataPersistence.fetch(
    CountryActions.CountryActionTypes.LOAD_DATE_FORMATS,
    {
      run: (action: CountryActions.LoadDateFormats) => {
        return this.lovService
          .getLov(LovMasterEnum.DATEFORMAT)
          .pipe(
            map(
              (dateFormats: Lov[]) =>
                new CountryActions.LoadDateFormatsSuccess(dateFormats)
            )
          );
      },
      onError: (
        action: CountryActions.LoadDateFormats,
        error: HttpErrorResponse
      ) => {
        return new CountryActions.LoadDateFormatsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.notificationService.error(customError);
    return customError;
  }
}
