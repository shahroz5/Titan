import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { PaymentConfigurationService } from '../payment-configuration.service';
import * as PaymentConfigurationAction from './payment-configuration.actions';
import { PaymentConfigurationActionTypes } from './payment-configuration.actions';

import { map, mergeMap } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  PaymentConfigurationList,
  CustomErrors,
  PaymentConfiguration,
  MappedCount,
  SelectedOptionsData
} from '@poss-web/shared/models';

@Injectable()
export class PaymentConfigurationEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public paymentConfigurationService: PaymentConfigurationService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  loadTcsPaymentMode$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.LOAD_TCS_PAYMENT_MODE,
    {
      run: (action: PaymentConfigurationAction.LoadTCSPaymentMode) => {
        return this.paymentConfigurationService
          .getTcsPaymentMode(action.payload)
          .pipe(
            map(
              tcsPaymentMode =>
                new PaymentConfigurationAction.LoadTCSPaymentModeSuccess(
                  tcsPaymentMode
                )
            )
          );
      },
      onError: (
        action: PaymentConfigurationAction.LoadTCSPaymentMode,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.LoadTCSPaymentModeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPaymentModeCount$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.LOAD_PAYMENT_MODE_COUNT,
    {
      run: (action: PaymentConfigurationAction.LoadPaymentModeCount) => {
        return this.paymentConfigurationService
          .getPaymentModeCount()
          .pipe(
            map(
              (count: number) =>
                new PaymentConfigurationAction.LoadPaymentModeCountSuccess(
                  count
                )
            )
          );
      },
      onError: (
        action: PaymentConfigurationAction.LoadPaymentModeCount,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.LoadPaymentModeCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPaymentConfigurationList$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_LIST,
    {
      run: (
        action: PaymentConfigurationAction.LoadPaymentConfigurationList
      ) => {
        return this.paymentConfigurationService
          .getPaymentConfigurationList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.description
          )
          .pipe(
            map(
              (paymentConfigurationList: PaymentConfigurationList) =>
                new PaymentConfigurationAction.LoadPaymentConfigurationListSuccess(
                  paymentConfigurationList
                )
            )
          );
      },
      onError: (
        action: PaymentConfigurationAction.LoadPaymentConfigurationList,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.LoadPaymentConfigurationListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchPaymentConfigurationList$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.SEARCH_PAYMENT_CONFIGURATION_LIST,
    {
      run: (
        action: PaymentConfigurationAction.SearchPaymentConfigurationList
      ) => {
        return this.paymentConfigurationService
          .searchPaymentConfigurationList(action.payload)
          .pipe(
            map(
              (paymentConfigurationList: PaymentConfigurationList) =>
                new PaymentConfigurationAction.SearchPaymentConfigurationListSuccess(
                  paymentConfigurationList
                )
            )
          );
      },
      onError: (
        action: PaymentConfigurationAction.SearchPaymentConfigurationList,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.SearchPaymentConfigurationListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  checkUniquePaymentName$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.CHECK_UNIQUE_PAYMENT_NAME,
    {
      run: (action: PaymentConfigurationAction.CheckUniquePaymentName) => {
        return this.paymentConfigurationService
          .searchPaymentConfigurationList(action.payload)
          .pipe(
            map(
              (paymentConfigurationList: PaymentConfigurationList) =>
                new PaymentConfigurationAction.CheckUniquePaymentNameSuccess(
                  paymentConfigurationList
                )
            )
          );
      },
      onError: (
        action: PaymentConfigurationAction.CheckUniquePaymentName,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.CheckUniquePaymentNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPaymentModesAndTransactionTypes$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES,
    {
      run: (
        action: PaymentConfigurationAction.LoadPaymentModesandTransactionTypes
      ) => {
        return this.paymentConfigurationService
          .getPaymentModes(action.payload.count)
          .pipe(
            mergeMap((res: any) => [
              new PaymentConfigurationAction.LoadPaymentModesandTransactionTypesSuccess(
                res
              ),
              action.payload.configId !== 'new'
                ? new PaymentConfigurationAction.LoadMappedCount(
                    action.payload.configId
                  )
                : new PaymentConfigurationAction.LoadPaymentModesandTransactionTypesSuccess(
                    res
                  )
            ])
          );
      },
      onError: (
        action: PaymentConfigurationAction.LoadPaymentModesandTransactionTypes,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.LoadPaymentModesandTransactionTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  SavePaymentConfiguration$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.SAVE_PAYMENT_CONFIGURATION,
    {
      run: (action: PaymentConfigurationAction.SavePaymentConfiguration) => {
        return this.paymentConfigurationService
          .savePaymentConfiguration(
            action.payload.paymentConfiguration,
            action.payload.saveData
          )
          .pipe(
            map(
              (configId: string) =>
                new PaymentConfigurationAction.SavePaymentConfigurationSuccess(
                  configId
                )
            )
          );
      },
      onError: (
        action: PaymentConfigurationAction.SavePaymentConfiguration,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.SavePaymentConfigurationSuccessFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updatePaymentConfiguration$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.UPADTE_PAYMENT_CONFIGURATION,
    {
      run: (action: PaymentConfigurationAction.UpdatePaymentConfiguration) => {
        return this.paymentConfigurationService
          .updatePaymentConfiguration(
            action.payload.configId,
            action.payload.data
          )
          .pipe(
            map(
              () =>
                new PaymentConfigurationAction.UpdatePaymentConfigurationSuccess()
            )
          );
      },
      onError: (
        action: PaymentConfigurationAction.UpdatePaymentConfiguration,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.UpdatePaymentConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPaymentConfigurationByConfigId$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID,
    {
      run: (
        action: PaymentConfigurationAction.LoadPaymentConfigurationByConfigId
      ) => {
        return this.paymentConfigurationService
          .getPaymentConfigurationByConfigId(action.payload)
          .pipe(
            map(
              (paymentConfiguration: PaymentConfiguration) =>
                new PaymentConfigurationAction.LoadPaymentConfigurationByConfigIdSuccess(
                  paymentConfiguration
                )
            )
          );
      },
      onError: (
        action: PaymentConfigurationAction.LoadPaymentConfigurationByConfigId,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.LoadPaymentConfigurationByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMappedCount$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.LOAD_MAPPED_COUNT,
    {
      run: (action: PaymentConfigurationAction.LoadMappedCount) => {
        return this.paymentConfigurationService
          .getMappedCount(action.payload)
          .pipe(
            map(
              (mappedCount: MappedCount[]) =>
                new PaymentConfigurationAction.LoadMappedCountSuccess(
                  mappedCount
                )
            )
          );
      },
      onError: (
        action: PaymentConfigurationAction.LoadMappedCount,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.LoadMappedCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSelectedPaymentConfigurationByConfigId$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID,
    {
      run: (
        action: PaymentConfigurationAction.LoadSelectedPaymentConfigurationDetailsByConfigId
      ) => {
        return this.paymentConfigurationService
          .getSelectedPaymentConfigurationDetailsByConfigId(
            action.payload.configId,
            action.payload.newCount,
            action.payload.paymentName
          )
          .pipe(
            map(
              (selectedPaymentConfigurationDetails: SelectedOptionsData) =>
                new PaymentConfigurationAction.LoadSelectedPaymentConfigurationDetailsByConfigIdSuccess(
                  selectedPaymentConfigurationDetails
                )
            )
          );
      },
      onError: (
        action: PaymentConfigurationAction.LoadSelectedPaymentConfigurationDetailsByConfigId,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.LoadSelectedPaymentConfigurationDetailsByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateSelectedPaymentConfigurationByConfigId$ = this.dataPersistence.fetch(
    PaymentConfigurationActionTypes.UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID,
    {
      run: (
        action: PaymentConfigurationAction.UpdateSelectedPaymentConfigurationDetailsByConfigId
      ) => {
        return this.paymentConfigurationService
          .updateSelectedPaymentConfigurationDetailsByConfigId(
            action.payload.configId,
            action.payload.data
          )
          .pipe(
            map(
              () =>
                new PaymentConfigurationAction.UpdateSelectedPaymentConfigurationDetailsByConfigIdSuccess()
            )
          );
      },
      onError: (
        action: PaymentConfigurationAction.UpdateSelectedPaymentConfigurationDetailsByConfigId,
        error: HttpErrorResponse
      ) => {
        return new PaymentConfigurationAction.UpdateSelectedPaymentConfigurationDetailsByConfigIdFailure(
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
