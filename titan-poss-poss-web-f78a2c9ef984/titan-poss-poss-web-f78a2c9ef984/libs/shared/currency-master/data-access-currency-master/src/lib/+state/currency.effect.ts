import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as CurrencyActions from './currency.action';
import { CurrencyService } from '../currency-master.service';
import { NotificationService } from '@poss-web/shared/util-notification';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CurrencyDetails,
  CustomErrors,
  LoadCurrencyListingSuccessPayload
} from '@poss-web/shared/models';

@Injectable()
export class CurrencyEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private notificationService: NotificationService,
    private currencyService: CurrencyService
  ) {}
  @Effect()
  loadCurrencyDetails$ = this.dataPersistence.fetch(
    CurrencyActions.CurrencyActionTypes.LOAD_CURRENCY_LISTING,
    {
      run: (action: CurrencyActions.LoadCurrencyDetails) => {
        return this.currencyService
          .getCurrencyDetails(action.payload)
          .pipe(
            map(
              (currencyDetails: LoadCurrencyListingSuccessPayload) =>
                new CurrencyActions.LoadCurrencyDetailsSuccess(currencyDetails)
            )
          );
      },
      onError: (
        action: CurrencyActions.LoadCurrencyDetails,
        error: HttpErrorResponse
      ) => {
        return new CurrencyActions.LoadCurrencyDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  LoadCurrencyDetailsByCurrencyCode$ = this.dataPersistence.fetch(
    CurrencyActions.CurrencyActionTypes.LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE,
    {
      run: (action: CurrencyActions.LoadCurrencyDetailsByCurrencyCode) => {
        return this.currencyService
          .getCurrencyDetailsByCurrencyCode(action.payload)
          .pipe(
            map(
              (CurrencyDetailsByCurrencyCode: CurrencyDetails) =>
                new CurrencyActions.LoadCurrencyDetailsByCurrencyCodeSuccess(
                  CurrencyDetailsByCurrencyCode
                )
            )
          );
      },
      onError: (
        action: CurrencyActions.LoadCurrencyDetailsByCurrencyCode,
        error: HttpErrorResponse
      ) => {
        return new CurrencyActions.LoadCurrencyDetailsByCurrencyCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveCurrencyFormDetails$ = this.dataPersistence.pessimisticUpdate(
    CurrencyActions.CurrencyActionTypes.SAVE_CURRENCY_FORM_DETAILS,
    {
      run: (action: CurrencyActions.SaveCurrencyFormDetails) => {
        return this.currencyService
          .saveCurrencyFormDetails(action.payload)
          .pipe(
            map((saveData: CurrencyDetails) => {
              return new CurrencyActions.SaveCurrencyFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: CurrencyActions.SaveCurrencyFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CurrencyActions.SaveCurrencyFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editCurrencyFormDetails$ = this.dataPersistence.pessimisticUpdate(
    CurrencyActions.CurrencyActionTypes.EDIT_CURRENCY_FORM_DETAILS,
    {
      run: (action: CurrencyActions.EditCurrencyFormDetails) => {
        return this.currencyService
          .editCurrencyFormDetails(action.payload)
          .pipe(
            map((saveData: CurrencyDetails) => {
              return new CurrencyActions.EditCurrencyFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: CurrencyActions.EditCurrencyFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CurrencyActions.EditCurrencyFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  SearchCurrency$ = this.dataPersistence.fetch(
    CurrencyActions.CurrencyActionTypes.SEARCH_CURRENCY_DETAILS,
    {
      run: (action: CurrencyActions.SearchCurrency) => {
        return this.currencyService
          .getCurrencyDetailsSearch(action.payload)
          .pipe(
            map(
              (SearchResult: CurrencyDetails[]) =>
                new CurrencyActions.SearchCurrencySuccess(SearchResult)
            )
          );
      },
      onError: (
        action: CurrencyActions.SearchCurrency,
        error: HttpErrorResponse
      ) => {
        return new CurrencyActions.SearchCurrencyFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    this.notificationService.error(customError);
    return customError;
  }
}
