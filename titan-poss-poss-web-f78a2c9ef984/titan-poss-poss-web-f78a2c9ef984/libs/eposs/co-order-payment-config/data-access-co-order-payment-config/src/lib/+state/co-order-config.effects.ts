import { Injectable } from '@angular/core';

import { LoggerService } from '@poss-web/shared/util-logger';
import * as CoOrderPaymentsConfigActions from './co-order-config.actions';
import {
  CustomErrors,
  CoOrderPaymentConfigList,
  ProductGroup,
  CoOrderpyamentRulesResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { HttpErrorResponse } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/Operators';
import { CoOrderPaymentConfigService } from '../co-order-payment-config.service';
import { CoOrderPaymentConfigActionTypes } from './co-order-config.actions';
import { ProductGroupDataService } from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class CoOrderPaymentConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private orderPaymentConfigService: CoOrderPaymentConfigService,
    public productGroupDataService: ProductGroupDataService
  ) {}

  @Effect()
  loadCoOrderPaymentConfig$: Observable<Action> = this.dataPersistence.fetch(
    CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_CONFIG_LIST,
    {
      run: (
        action: CoOrderPaymentsConfigActions.LoadCoOrderPaymentsConfigList
      ) => {
        return this.orderPaymentConfigService
          .getCoOrderPaymentConfigList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.description
          )
          .pipe(
            map(
              (payload: CoOrderPaymentConfigList) =>
                new CoOrderPaymentsConfigActions.LoadCoOrderPaymentsConfigListSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: CoOrderPaymentsConfigActions.LoadCoOrderPaymentsConfigList,
        error: HttpErrorResponse
      ) => {
        return new CoOrderPaymentsConfigActions.LoadCoOrderPaymentsConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateIsActive$ = this.dataPersistence.fetch(
    CoOrderPaymentConfigActionTypes.UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE,
    {
      run: (action: CoOrderPaymentsConfigActions.UpdateConfigIsActive) => {
        return this.orderPaymentConfigService
          .updateIsActive(action.payload.id, action.payload.data)
          .pipe(
            map(
              () =>
                new CoOrderPaymentsConfigActions.UpdateConfigIsActiveSuccess('')
            )
          );
      },
      onError: (
        action: CoOrderPaymentsConfigActions.UpdateConfigIsActive,
        error: HttpErrorResponse
      ) => {
        return new CoOrderPaymentsConfigActions.UpdateConfigIsActiveFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadSelectedConfigDetails$ = this.dataPersistence.fetch(
    CoOrderPaymentConfigActionTypes.LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS,
    {
      run: (action: CoOrderPaymentsConfigActions.LoadSelectedConfigDetails) => {
        return this.orderPaymentConfigService
          .getSelectedConfigDetails(action.payload)
          .pipe(
            map(
              selectedConfigData =>
                new CoOrderPaymentsConfigActions.LoadSelectedConfigDetailsSuccess(
                  selectedConfigData
                )
            )
          );
      },
      onError: (
        action: CoOrderPaymentsConfigActions.LoadSelectedConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new CoOrderPaymentsConfigActions.LoadSelectedConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  SearchConfigDetailsByConfigName$ = this.dataPersistence.fetch(
    CoOrderPaymentConfigActionTypes.SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME,
    {
      run: (
        action: CoOrderPaymentsConfigActions.SearchConfigDetailsByConfigName
      ) => {
        return this.orderPaymentConfigService
          .searchConfigDetailsByconfigName(action.payload)
          .pipe(
            map(
              (payload: CoOrderPaymentConfigList) =>
                new CoOrderPaymentsConfigActions.SearchConfigDetailsByConfigNameSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: CoOrderPaymentsConfigActions.SearchConfigDetailsByConfigName,
        error: HttpErrorResponse
      ) => {
        return new CoOrderPaymentsConfigActions.SearchConfigDetailsByConfigNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadProductGroups$ = this.dataPersistence.fetch(
    CoOrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS,
    {
      run: (action: CoOrderPaymentsConfigActions.LoadProductGroupMapping) => {
        return this.productGroupDataService
          .getProductGroups(false)
          .pipe(
            map(
              (productGroup: ProductGroup[]) =>
                new CoOrderPaymentsConfigActions.LoadProductGroupMappingSuccess(
                  productGroup
                )
            )
          );
      },
      onError: (
        action: CoOrderPaymentsConfigActions.LoadProductGroupMapping,
        error: HttpErrorResponse
      ) => {
        return new CoOrderPaymentsConfigActions.LoadProductGroupMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveCoOrderpaymentConfig$ = this.dataPersistence.fetch(
    CoOrderPaymentConfigActionTypes.SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS,
    {
      run: (action: CoOrderPaymentsConfigActions.SaveOderPaymentConfig) => {
        return this.orderPaymentConfigService
          .saveCoOrderPaymentsConfig(
            action.payload.configDetail,
            action.payload.orderPaymentConfigRequest
          )
          .pipe(
            map(
              (configId: string) =>
                new CoOrderPaymentsConfigActions.SaveOderPaymentConfigSuccess(
                  configId
                )
            )
          );
      },
      onError: (
        action: CoOrderPaymentsConfigActions.SaveOderPaymentConfig,
        error: HttpErrorResponse
      ) => {
        return new CoOrderPaymentsConfigActions.SaveOderPaymentConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  removeConfig$ = this.dataPersistence.fetch(
    CoOrderPaymentConfigActionTypes.REMOVE_CO_ORDER_PAYMENT_CONFIG,
    {
      run: (
        action: CoOrderPaymentsConfigActions.RemoveCoOrderPaymentConfig
      ) => {
        return this.orderPaymentConfigService
          .removeConfig(action.payload.id, action.payload.data)
          .pipe(
            map(
              (payload: any) =>
                new CoOrderPaymentsConfigActions.RemoveCoOrderPaymentConfigSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: CoOrderPaymentsConfigActions.RemoveCoOrderPaymentConfig,
        error: HttpErrorResponse
      ) => {
        return new CoOrderPaymentsConfigActions.RemoveCoOrderPaymentConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateConfig$ = this.dataPersistence.fetch(
    CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG,
    {
      run: (
        action: CoOrderPaymentsConfigActions.UpdateCoOrderPaymentConfig
      ) => {
        return this.orderPaymentConfigService
          .updateConfig(action.payload.id, action.payload.data)
          .pipe(
            map(
              (payload: any) =>
                new CoOrderPaymentsConfigActions.UpdateCoOrderPaymentConfigSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: CoOrderPaymentsConfigActions.UpdateCoOrderPaymentConfig,
        error: HttpErrorResponse
      ) => {
        return new CoOrderPaymentsConfigActions.UpdateCoOrderPaymentConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadWeightToleranceByConfigId$ = this.dataPersistence.fetch(
    CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID,
    {
      run: (
        action: CoOrderPaymentsConfigActions.LoadCoOrderConfigByConfigId
      ) => {
        return this.orderPaymentConfigService
          .getSelectedConfigPaymentDetails(action.payload)
          .pipe(
            map(
              (payload: CoOrderpyamentRulesResponse) =>
                new CoOrderPaymentsConfigActions.LoadCoOrderConfigByConfigIdSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: CoOrderPaymentsConfigActions.LoadCoOrderConfigByConfigId,
        error: HttpErrorResponse
      ) => {
        return new CoOrderPaymentsConfigActions.LoadCoOrderConfigByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  allConfigRuleDetails$ = this.dataPersistence.fetch(
    CoOrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES,
    {
      run: (action: CoOrderPaymentsConfigActions.LoadAllConfigRules) => {
        return this.orderPaymentConfigService
          .getSelectedConfigPaymentDetails(action.payload)
          .pipe(
            map(
              (payload: CoOrderpyamentRulesResponse) =>
                new CoOrderPaymentsConfigActions.LoadAllConfigRulesSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: CoOrderPaymentsConfigActions.LoadAllConfigRules,
        error: HttpErrorResponse
      ) => {
        return new CoOrderPaymentsConfigActions.LoadAllConfigRulesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  UniqueNameCheck$: Observable<Action> = this.dataPersistence.fetch(
    CoOrderPaymentConfigActionTypes.CO_ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK,
    {
      run: (
        action: CoOrderPaymentsConfigActions.UniqueConfigurationNameCheck
      ) => {
        return this.orderPaymentConfigService
          .uniqueConfigNameCheck(action.payload)
          .pipe(
            map(
              (count: number) =>
                new CoOrderPaymentsConfigActions.UniqueConfigurationNameCheckSuccess(
                  count
                )
            )
          );
      },
      onError: (
        action: CoOrderPaymentsConfigActions.UniqueConfigurationNameCheck,
        error: HttpErrorResponse
      ) => {
        return new CoOrderPaymentsConfigActions.UniqueConfigurationNameCheckFailure(
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
