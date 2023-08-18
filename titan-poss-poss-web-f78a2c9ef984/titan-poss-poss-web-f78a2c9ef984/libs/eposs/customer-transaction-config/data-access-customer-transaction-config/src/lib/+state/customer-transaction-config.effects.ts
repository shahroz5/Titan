import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomerTransactionConfigService } from '../customer-transaction-config.service';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { CustomerTransactionConfigActionTypes } from './customer-transaction-config.actions';
import * as CustomerTransactionConfigActions from './customer-transaction-config.actions';
import { map } from 'rxjs/operators';
import {
  CustomerTransactionConfigListResponse,
  CustomErrors,
  CustomerTransactionConfig,
  CheckBoxHeader,
  CustomerConfigDetails,
} from '@poss-web/shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrorAdaptor
} from '@poss-web/shared/util-adaptors';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class CustomerTransactionConfigEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private customerTransactionConfigService: CustomerTransactionConfigService,
    private lovDataService: LovDataService
  ) {}
  @Effect()
  loadCustomerTransactionConfigList$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CustomerTransactionConfigActionTypes.LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST,
    {
      run: (
        action: CustomerTransactionConfigActions.LoadCustomerTransactionConfigList
      ) => {
        return this.customerTransactionConfigService
          .loadConfigList(action.payload)
          .pipe(
            map(
              (configList: CustomerTransactionConfigListResponse) =>
                new CustomerTransactionConfigActions.LoadCustomerTransactionConfigListSuccess(
                  configList
                )
            )
          );
      },
      onError: (
        action: CustomerTransactionConfigActions.LoadCustomerTransactionConfigList,
        error: HttpErrorResponse
      ) => {
        return new CustomerTransactionConfigActions.LoadCustomerTransactionConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchConfigName$: Observable<Action> = this.dataPersistence.fetch(
    CustomerTransactionConfigActionTypes.SEARCH_CONFIG_NAME,
    {
      run: (action: CustomerTransactionConfigActions.SearchConfigName) => {
        return this.customerTransactionConfigService
          .searchConfigName(action.payload)
          .pipe(
            map(
              (configList: CustomerTransactionConfig[]) =>
                new CustomerTransactionConfigActions.SearchConfigNameSuccess(
                  configList
                )
            )
          );
      },
      onError: (
        action: CustomerTransactionConfigActions.SearchConfigName,
        error: HttpErrorResponse
      ) => {
        return new CustomerTransactionConfigActions.SearchConfigNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateConfigStatus$: Observable<Action> = this.dataPersistence.fetch(
    CustomerTransactionConfigActionTypes.UPDATE_CONFIG_STATUS,
    {
      run: (action: CustomerTransactionConfigActions.UpdateConfigStatus) => {
        return this.customerTransactionConfigService
          .updateStatus(action.payload)
          .pipe(
            map(
              () =>
                new CustomerTransactionConfigActions.UpdateConfigStatusSucceess()
            )
          );
      },
      onError: (
        action: CustomerTransactionConfigActions.UpdateConfigStatus,
        error: HttpErrorResponse
      ) => {
        return new CustomerTransactionConfigActions.UpdateConfigStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadTransactionTypes$: Observable<Action> = this.dataPersistence.fetch(
    CustomerTransactionConfigActionTypes.LOAD_TRANSACTIONTYPES,
    {
      run: (action: CustomerTransactionConfigActions.LoadTransactionTypes) => {
        return this.customerTransactionConfigService
          .getTransactionTypes(action.payload)
          .pipe(
            map(
              (transactionTypes: CheckBoxHeader[]) =>
                new CustomerTransactionConfigActions.LoadTransactionTypesSuccess(
                  transactionTypes
                )
            )
          );
      },
      onError: (
        action: CustomerTransactionConfigActions.LoadTransactionTypes,
        error: HttpErrorResponse
      ) => {
        return new CustomerTransactionConfigActions.LoadTransactionTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadCustomers$: Observable<Action> = this.dataPersistence.fetch(
    CustomerTransactionConfigActionTypes.LOAD_CUSTOMERS,
    {
      run: (action: CustomerTransactionConfigActions.LoadCustomers) => {
        return this.customerTransactionConfigService
          .loadCustomers()
          .pipe(
            map(
              (transactionTypes: CheckBoxHeader[]) =>
                new CustomerTransactionConfigActions.LoadCustomersSuccess(
                  transactionTypes
                )
            )
          );
      },
      onError: (
        action: CustomerTransactionConfigActions.LoadCustomers,
        error: HttpErrorResponse
      ) => {
        return new CustomerTransactionConfigActions.LoadCustomersFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveCustomerTransConfigDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CustomerTransactionConfigActionTypes.SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS,
    {
      run: (
        action: CustomerTransactionConfigActions.SaveCustomerTransactionConfigDetails
      ) => {
        return this.customerTransactionConfigService
          .saveCustomerTranConfigDetails(action.payload)
          .pipe(
            map(
              (configId: string) =>
                new CustomerTransactionConfigActions.SaveCustomerTransactionConfigDetailsSuccess(
                  configId
                )
            )
          );
      },
      onError: (
        action: CustomerTransactionConfigActions.SaveCustomerTransactionConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerTransactionConfigActions.SaveCustomerTransactionConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateCustomerTransConfigDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CustomerTransactionConfigActionTypes.UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS,
    {
      run: (
        action: CustomerTransactionConfigActions.UpdateCustomerTransactionConfigDetails
      ) => {
        return this.customerTransactionConfigService
          .updateCustomerTranConfigDetails(action.payload)
          .pipe(
            map(
              () =>
                new CustomerTransactionConfigActions.UpdateCustomerTransactionConfigDetailsSuccess()
            )
          );
      },
      onError: (
        action: CustomerTransactionConfigActions.UpdateCustomerTransactionConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerTransactionConfigActions.UpdateCustomerTransactionConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  getCustomerTransConfigDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CustomerTransactionConfigActionTypes.GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS,
    {
      run: (
        action: CustomerTransactionConfigActions.GetCustomerTransactionConfigDetails
      ) => {
        return this.customerTransactionConfigService
          .getCustomerTranConfigDetails(action.payload)
          .pipe(
            map(
              (configResponse: CustomerConfigDetails) =>
                new CustomerTransactionConfigActions.GetCustomerTransactionConfigDetailsSuccess(
                  configResponse
                )
            )
          );
      },
      onError: (
        action: CustomerTransactionConfigActions.GetCustomerTransactionConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerTransactionConfigActions.GetCustomerTransactionConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // @Effect()
  // loadCOnfigType$: Observable<Action> = this.dataPersistence.fetch(
  //   CustomerTransactionConfigActionTypes.LOAD_CONFIG_TYPE,
  //   {
  //     run: (action: CustomerTransactionConfigActions.LoadConfigType) => {
  //       return this.customerTransactionConfigService
  //         .getConfigType()
  //         .pipe(
  //           map(
  //             (configType: string) =>
  //               new CustomerTransactionConfigActions.LoadConfigTypeSuccess(
  //                 configType
  //               )
  //           )
  //         );
  //     },
  //     onError: (
  //       action: CustomerTransactionConfigActions.LoadConfigType,
  //       error: HttpErrorResponse
  //     ) => {
  //       return new CustomerTransactionConfigActions.LoadConfigTypeFailure(
  //         this.errorHandler(error)
  //       );
  //     }
  //   }
  // );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
  // transactionTypes(transactionTypes: Lov[]) {
  //   const transTypes: CheckBoxHeader[] = CustomerTransactionConfigAdaptor.getTransactionTypes(
  //     transactionTypes
  //   );
  //   return transTypes;
  // }
}
