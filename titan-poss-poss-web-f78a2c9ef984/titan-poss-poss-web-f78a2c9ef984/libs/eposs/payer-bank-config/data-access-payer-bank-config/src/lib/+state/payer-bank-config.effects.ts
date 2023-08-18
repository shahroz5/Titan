import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { PayerBankConfigActionTypes } from './payer-bank-config.actions';
import * as PayerBankConfigurationActions from './payer-bank-config.actions';
import { PayerBankConfigService } from '../payer-bank-config.service';
import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  PayerBankConfigListingSuccessPaylod,
  CustomErrors,
  PayerBankConfigDetails,
  PaymentModeResponse,
  PayerBankMaster,
  PayerBankConfiguration,
  PayerBanksResponse
} from '@poss-web/shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
@Injectable()
export class PayerBankConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private payerBankConfigService: PayerBankConfigService
  ) {}
  @Effect()
  loadPayerBankConfigurations$ = this.dataPersistence.fetch(
    PayerBankConfigActionTypes.LOAD_PAYER_BANK_CONFIGURATIONS,
    {
      run: (
        action: PayerBankConfigurationActions.LoadPayerBankConfigurations
      ) => {
        return this.payerBankConfigService
          .getPayerBankConfigListing(action.payload)
          .pipe(
            map(
              (payerBankConfigurations: PayerBankConfigListingSuccessPaylod) =>
                new PayerBankConfigurationActions.LoadPayerBankConfigurationsSuccess(
                  payerBankConfigurations
                )
            )
          );
      },
      onError: (
        action: PayerBankConfigurationActions.LoadPayerBankConfigurations,
        error: HttpErrorResponse
      ) => {
        return new PayerBankConfigurationActions.LoadPayerBankConfigurationsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  savePayerBankConfigDetails$ = this.dataPersistence.fetch(
    PayerBankConfigActionTypes.SAVE_PAYER_BANK_CONFIG_DETAILS,
    {
      run: (
        action: PayerBankConfigurationActions.SavePayerBankConfigDetails
      ) => {
        return this.payerBankConfigService
          .savePayerBankDetails(action.payload)
          .pipe(
            map(
              (configId: string) =>
                new PayerBankConfigurationActions.SavePayerBankConfigDetailsSuccess(
                  configId
                )
            )
          );
      },
      onError: (
        action: PayerBankConfigurationActions.SavePayerBankConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new PayerBankConfigurationActions.SavePayerBankConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  payerBankConfigDetailsById$ = this.dataPersistence.fetch(
    PayerBankConfigActionTypes.PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME,
    {
      run: (
        action: PayerBankConfigurationActions.PayerBankDetailsByConfigName
      ) => {
        return this.payerBankConfigService
          .payerBankDetailsById(action.payload)
          .pipe(
            map(
              (payerBankConfigDetails: PayerBankConfigDetails) =>
                new PayerBankConfigurationActions.PayerBankDetailsByConfigNameSuccess(
                  payerBankConfigDetails
                )
            )
          );
      },
      onError: (
        action: PayerBankConfigurationActions.PayerBankDetailsByConfigName,
        error: HttpErrorResponse
      ) => {
        return new PayerBankConfigurationActions.PayerBankDetailsByConfigNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updatePayerBankConfigDetails$ = this.dataPersistence.fetch(
    PayerBankConfigActionTypes.UPDATE_PAYER_BANK_CONFIG_DETAILS,
    {
      run: (
        action: PayerBankConfigurationActions.UpdatePayerBankConfigDetails
      ) => {
        return this.payerBankConfigService
          .updatePayerBankConfigDetails(action.payload)
          .pipe(
            map(
              () =>
                new PayerBankConfigurationActions.UpdatePayerBankConfigDetailsSuccess()
            )
          );
      },
      onError: (
        action: PayerBankConfigurationActions.UpdatePayerBankConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new PayerBankConfigurationActions.UpdatePayerBankConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchConfigName$ = this.dataPersistence.fetch(
    PayerBankConfigActionTypes.SEARCH_CONFIG_NAME,
    {
      run: (action: PayerBankConfigurationActions.SearchConfigName) => {
        return this.payerBankConfigService
          .searchConfigName(action.payload)
          .pipe(
            map(
              (searchPayload: PayerBankConfiguration[]) =>
                new PayerBankConfigurationActions.SearchConfigNameSuccess(
                  searchPayload
                )
            )
          );
      },
      onError: (
        action: PayerBankConfigurationActions.SearchConfigName,
        error: HttpErrorResponse
      ) => {
        return new PayerBankConfigurationActions.SearchConfigNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadPayerBanks$ = this.dataPersistence.fetch(
    PayerBankConfigActionTypes.LOAD_PAYER_BANKS,
    {
      run: (action: PayerBankConfigurationActions.LoadPayerBanks) => {
        return this.payerBankConfigService
          .loadPayerBanks(action.payload)
          .pipe(
            map(
              (payerBanks: PayerBanksResponse) =>
                new PayerBankConfigurationActions.LoadPayerBanksSuccess(
                  payerBanks
                )
            )
          );
      },
      onError: (
        action: PayerBankConfigurationActions.LoadPayerBanks,
        error: HttpErrorResponse
      ) => {
        return new PayerBankConfigurationActions.LoadPayerBanksFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateToggleButton$ = this.dataPersistence.fetch(
    PayerBankConfigActionTypes.UPDATE_TOGGLE_BUTTON,
    {
      run: (action: PayerBankConfigurationActions.UpdateToggleButton) => {
        return this.payerBankConfigService
          .updateToggleButton(action.payload)
          .pipe(
            map(
              () =>
                new PayerBankConfigurationActions.UpdateToggleButtonSuccess()
            )
          );
      },
      onError: (
        action: PayerBankConfigurationActions.UpdateToggleButton,
        error: HttpErrorResponse
      ) => {
        return new PayerBankConfigurationActions.UpdateToggleButtonFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadPaymentModes$ = this.dataPersistence.fetch(
    PayerBankConfigActionTypes.LOAD_PAYMENT_MODES,
    {
      run: (action: PayerBankConfigurationActions.LoadPaymentModes) => {
        return this.payerBankConfigService
          .loadPaymentModes()
          .pipe(
            map(
              (paymentModes: PaymentModeResponse[]) =>
                new PayerBankConfigurationActions.LoadPaymentModesSuccess(
                  paymentModes
                )
            )
          );
      },
      onError: (
        action: PayerBankConfigurationActions.LoadPaymentModes,
        error: HttpErrorResponse
      ) => {
        return new PayerBankConfigurationActions.LoadPaymentModesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchPayerBank$: Observable<Action> = this.dataPersistence.fetch(
    PayerBankConfigActionTypes.SEARCH_PAYER_BANK,
    {
      run: (action: PayerBankConfigurationActions.SearchPayerBank) => {
        return this.payerBankConfigService
          .searchPayerBanks(action.payload)
          .pipe(
            map(
              (searchResponse: PayerBankMaster[]) =>
                new PayerBankConfigurationActions.SearchPayerBankSuccess(
                  searchResponse
                )
            )
          );
      },
      onError: (
        action: PayerBankConfigurationActions.SearchPayerBank,
        error: HttpErrorResponse
      ) => {
        return new PayerBankConfigurationActions.SearchPayerBankFailure(
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
