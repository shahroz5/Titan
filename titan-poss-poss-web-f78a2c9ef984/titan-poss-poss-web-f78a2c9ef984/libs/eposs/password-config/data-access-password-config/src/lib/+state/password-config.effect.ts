import { Injectable } from '@angular/core';
import {
  CustomErrors,
  LocationSummaryList,
  MetalRates,
  GenerateBoutiquePasswordForGoldRateResponse,
  GenerateBoutiquePasswordForManualBillResponse,
  GenerateCashDepositPasswordResponse,
  TransactionTypes
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { PasswordConfigActionTypes } from './password-config.actions';
import * as PasswordConfigActions from './password-config.actions';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { HttpErrorResponse } from '@angular/common/http';
import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import {
  LocationDataService,
  PaymentDataService
} from '@poss-web/shared/masters/data-access-masters';
import { PasswordConfigService } from '../password-config.service';
import { PasswordConfigState } from './password-config.state';
import { CommonService } from '@poss-web/shared/common/data-access-common';
@Injectable()
export class PasswordConfigEffects {
  constructor(
    private loggerService: LoggerService,
    private dataPersistence: DataPersistence<PasswordConfigState>,
    private passwordConfigService: PasswordConfigService,
    private locationDataService: LocationDataService,
    private paymentDataService: PaymentDataService,
    private commonService: CommonService
  ) {}

  @Effect() getLocationCodes$: Observable<Action> = this.dataPersistence.fetch(
    PasswordConfigActionTypes.GET_LOCATION_CODES,
    {
      run: (action: PasswordConfigActions.GetLocationCodes) => {
        const filterForLocation = {
          locationTypes: ['BTQ']
        };
        const sortType = ['locationCode,ASC'];
        return this.locationDataService
          .getLocationSummaryList(
            filterForLocation,
            false,
            null,
            null,
            sortType
          )
          .pipe(
            map(
              (data: LocationSummaryList[]) =>
                new PasswordConfigActions.GetLocationCodesSuccess(data)
            )
          );
      },

      onError: (
        action: PasswordConfigActions.GetLocationCodes,
        error: HttpErrorResponse
      ) => {
        return new PasswordConfigActions.GetLocationCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getDocumentTypes$: Observable<Action> = this.dataPersistence.fetch(
    PasswordConfigActionTypes.GET_DOCUMENT_TYPES,
    {
      run: (action: PasswordConfigActions.GetDocumentTypes) => {
        return this.paymentDataService
          .getPaymentTransactionTypes(null, null, null, 'MANUAL_BILL_ALLOWED')
          .pipe(
            map(
              (data: TransactionTypes[]) =>
                new PasswordConfigActions.GetDocumentTypesSuccess(data)
            )
          );
      },

      onError: (
        action: PasswordConfigActions.GetDocumentTypes,
        error: HttpErrorResponse
      ) => {
        return new PasswordConfigActions.GetDocumentTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getMaterialPrices$: Observable<Action> = this.dataPersistence.fetch(
    PasswordConfigActionTypes.GET_MATERIAL_PRICES,
    {
      run: (action: PasswordConfigActions.GetMaterialPrices) => {
        return this.commonService
          .getStandardMaterialPriceDetailsHistory(action.payload)
          .pipe(
            map(
              (data: MetalRates[]) =>
                new PasswordConfigActions.GetMaterialPricesSuccess(data)
            )
          );
      },

      onError: (
        action: PasswordConfigActions.GetMaterialPrices,
        error: HttpErrorResponse
      ) => {
        return new PasswordConfigActions.GetMaterialPricesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() generateBoutiquePasswordForManualBill$: Observable<
    Action
  > = this.dataPersistence.fetch(
    PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_MANUAL_BILL,
    {
      run: (
        action: PasswordConfigActions.GenerateBoutiquePasswordForManualBill
      ) => {
        return this.passwordConfigService
          .generateBoutiquePasswordForManualBill(action.payload)
          .pipe(
            map(
              (data: GenerateBoutiquePasswordForManualBillResponse) =>
                new PasswordConfigActions.GenerateBoutiquePasswordForManualBillSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: PasswordConfigActions.GenerateBoutiquePasswordForManualBill,
        error: HttpErrorResponse
      ) => {
        return new PasswordConfigActions.GenerateBoutiquePasswordForManualBillFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() generateBoutiquePasswordForGoldRate$: Observable<
    Action
  > = this.dataPersistence.fetch(
    PasswordConfigActionTypes.GENERATE_BOUTIQUE_PASSWORD_FOR_GOLD_RATE,
    {
      run: (
        action: PasswordConfigActions.GenerateBoutiquePasswordForGoldRate
      ) => {
        return this.passwordConfigService
          .generateBoutiquePasswordForGoldRate(action.payload)
          .pipe(
            map(
              (data: GenerateBoutiquePasswordForGoldRateResponse) =>
                new PasswordConfigActions.GenerateBoutiquePasswordForGoldRateSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: PasswordConfigActions.GenerateBoutiquePasswordForGoldRate,
        error: HttpErrorResponse
      ) => {
        return new PasswordConfigActions.GenerateBoutiquePasswordForGoldRateFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() generateCashDepostPassword$: Observable<
    Action
  > = this.dataPersistence.fetch(
    PasswordConfigActionTypes.GENERATE_CASH_DEPOSIT_PASSWORD,
    {
      run: (action: PasswordConfigActions.GenerateCashDepositPassword) => {
        return this.passwordConfigService
          .generateCashDepositPassword(action.payload)
          .pipe(
            map(
              (data: GenerateCashDepositPasswordResponse) =>
                new PasswordConfigActions.GenerateCashDepositPasswordSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: PasswordConfigActions.GenerateCashDepositPassword,
        error: HttpErrorResponse
      ) => {
        return new PasswordConfigActions.GenerateCashDepositPasswordFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
