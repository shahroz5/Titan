import { Injectable } from '@angular/core';

import { LoggerService } from '@poss-web/shared/util-logger';
import * as OrderPaymentsConfigActions from './order-config.actions';
import {
  CustomErrors,
  OrderPaymentConfigList,
  ProductGroup,
  OrderpyamentRulesResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { HttpErrorResponse } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/Operators';
import { OrderPaymentConfigService } from '../order-payment-config.service';
import { OrderPaymentConfigActionTypes } from './order-config.actions';
import { ProductGroupDataService } from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class OrderPaymentConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private orderPaymentConfigService: OrderPaymentConfigService,
    public productGroupDataService: ProductGroupDataService
  ) {}

  @Effect()
  loadOrderPaymentConfig$: Observable<Action> = this.dataPersistence.fetch(
    OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_CONFIG_LIST,
    {
      run: (action: OrderPaymentsConfigActions.LoadOrderPaymentsConfigList) => {
        return this.orderPaymentConfigService
          .getOrderPaymentConfigList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.description
          )
          .pipe(
            map(
              (payload: OrderPaymentConfigList) =>
                new OrderPaymentsConfigActions.LoadOrderPaymentsConfigListSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: OrderPaymentsConfigActions.LoadOrderPaymentsConfigList,
        error: HttpErrorResponse
      ) => {
        return new OrderPaymentsConfigActions.LoadOrderPaymentsConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateIsActive$ = this.dataPersistence.fetch(
    OrderPaymentConfigActionTypes.UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE,
    {
      run: (action: OrderPaymentsConfigActions.UpdateConfigIsActive) => {
        return this.orderPaymentConfigService
          .updateIsActive(action.payload.id, action.payload.data)
          .pipe(
            map(
              () =>
                new OrderPaymentsConfigActions.UpdateConfigIsActiveSuccess('')
            )
          );
      },
      onError: (
        action: OrderPaymentsConfigActions.UpdateConfigIsActive,
        error: HttpErrorResponse
      ) => {
        return new OrderPaymentsConfigActions.UpdateConfigIsActiveFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadSelectedConfigDetails$ = this.dataPersistence.fetch(
    OrderPaymentConfigActionTypes.LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS,
    {
      run: (action: OrderPaymentsConfigActions.LoadSelectedConfigDetails) => {
        return this.orderPaymentConfigService
          .getSelectedConfigDetails(action.payload)
          .pipe(
            map(
              selectedConfigData =>
                new OrderPaymentsConfigActions.LoadSelectedConfigDetailsSuccess(
                  selectedConfigData
                )
            )
          );
      },
      onError: (
        action: OrderPaymentsConfigActions.LoadSelectedConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new OrderPaymentsConfigActions.LoadSelectedConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  SearchConfigDetailsByConfigName$ = this.dataPersistence.fetch(
    OrderPaymentConfigActionTypes.SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME,
    {
      run: (
        action: OrderPaymentsConfigActions.SearchConfigDetailsByConfigName
      ) => {
        return this.orderPaymentConfigService
          .searchConfigDetailsByconfigName(action.payload)
          .pipe(
            map(
              (payload: OrderPaymentConfigList) =>
                new OrderPaymentsConfigActions.SearchConfigDetailsByConfigNameSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: OrderPaymentsConfigActions.SearchConfigDetailsByConfigName,
        error: HttpErrorResponse
      ) => {
        return new OrderPaymentsConfigActions.SearchConfigDetailsByConfigNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadProductGroups$ = this.dataPersistence.fetch(
    OrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS,
    {
      run: (action: OrderPaymentsConfigActions.LoadProductGroupMapping) => {
        return this.productGroupDataService
          .getProductGroups(false)
          .pipe(
            map(
              (productGroup: ProductGroup[]) =>
                new OrderPaymentsConfigActions.LoadProductGroupMappingSuccess(
                  productGroup
                )
            )
          );
      },
      onError: (
        action: OrderPaymentsConfigActions.LoadProductGroupMapping,
        error: HttpErrorResponse
      ) => {
        return new OrderPaymentsConfigActions.LoadProductGroupMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveOrderpaymentConfig$ = this.dataPersistence.fetch(
    OrderPaymentConfigActionTypes.SAVE_ORDER_PAYMENT_CONFIG_DETAILS,
    {
      run: (action: OrderPaymentsConfigActions.SaveOderPaymentConfig) => {
        return this.orderPaymentConfigService
          .saveOrderPaymentsConfig(
            action.payload.configDetail,
            action.payload.orderPaymentConfigRequest
          )
          .pipe(
            map(
              (configId: string) =>
                new OrderPaymentsConfigActions.SaveOderPaymentConfigSuccess(
                  configId
                )
            )
          );
      },
      onError: (
        action: OrderPaymentsConfigActions.SaveOderPaymentConfig,
        error: HttpErrorResponse
      ) => {
        return new OrderPaymentsConfigActions.SaveOderPaymentConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  removeConfig$ = this.dataPersistence.fetch(
    OrderPaymentConfigActionTypes.REMOVE_ORDER_PAYMENT_CONFIG,
    {
      run: (action: OrderPaymentsConfigActions.RemoveOrderPaymentConfig) => {
        return this.orderPaymentConfigService
          .removeConfig(action.payload.id, action.payload.data)
          .pipe(
            map(
              (payload: any) =>
                new OrderPaymentsConfigActions.RemoveOrderPaymentConfigSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: OrderPaymentsConfigActions.RemoveOrderPaymentConfig,
        error: HttpErrorResponse
      ) => {
        return new OrderPaymentsConfigActions.RemoveOrderPaymentConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateConfig$ = this.dataPersistence.fetch(
    OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG,
    {
      run: (action: OrderPaymentsConfigActions.UpdateOrderPaymentConfig) => {
        return this.orderPaymentConfigService
          .updateConfig(action.payload.id, action.payload.data)
          .pipe(
            map(
              (payload: any) =>
                new OrderPaymentsConfigActions.UpdateOrderPaymentConfigSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: OrderPaymentsConfigActions.UpdateOrderPaymentConfig,
        error: HttpErrorResponse
      ) => {
        return new OrderPaymentsConfigActions.UpdateOrderPaymentConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadWeightToleranceByConfigId$ = this.dataPersistence.fetch(
    OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_BY_CONFIG_ID,
    {
      run: (action: OrderPaymentsConfigActions.LoadOrderConfigByConfigId) => {
        return this.orderPaymentConfigService
          .getSelectedConfigPaymentDetails(action.payload)
          .pipe(
            map(
              (payload: OrderpyamentRulesResponse) =>
                new OrderPaymentsConfigActions.LoadOrderConfigByConfigIdSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: OrderPaymentsConfigActions.LoadOrderConfigByConfigId,
        error: HttpErrorResponse
      ) => {
        return new OrderPaymentsConfigActions.LoadOrderConfigByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  allConfigRuleDetails$ = this.dataPersistence.fetch(
    OrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES,
    {
      run: (action: OrderPaymentsConfigActions.LoadAllConfigRules) => {
        return this.orderPaymentConfigService
          .getSelectedConfigPaymentDetails(action.payload)
          .pipe(
            map(
              (payload: OrderpyamentRulesResponse) =>
                new OrderPaymentsConfigActions.LoadAllConfigRulesSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: OrderPaymentsConfigActions.LoadAllConfigRules,
        error: HttpErrorResponse
      ) => {
        return new OrderPaymentsConfigActions.LoadAllConfigRulesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  UniqueNameCheck$: Observable<Action> = this.dataPersistence.fetch(
    OrderPaymentConfigActionTypes.ORDER_PAYMENT_CONFIG_UNIQUE_NAME_CHECK,
    {
      run: (action: OrderPaymentsConfigActions.UniqueConfigurationNameCheck) => {
        return this.orderPaymentConfigService
          .uniqueConfigNameCheck(action.payload)
          .pipe(
            map(
              (count: number) =>
                new OrderPaymentsConfigActions.UniqueConfigurationNameCheckSuccess(
                  count
                )
            )
          );
      },
      onError: (
        action: OrderPaymentsConfigActions.UniqueConfigurationNameCheck,
        error: HttpErrorResponse
      ) => {
        return new OrderPaymentsConfigActions.UniqueConfigurationNameCheckFailure(
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
