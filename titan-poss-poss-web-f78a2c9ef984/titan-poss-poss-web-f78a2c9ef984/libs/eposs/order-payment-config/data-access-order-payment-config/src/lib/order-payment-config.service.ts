import { Injectable } from '@angular/core';
import {
  ApiService,
  getConfigurationListUrl,
  getUpdateConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getSaveConfigurationUrl,
  getProductGroupMappingRulesUrl,
  getProductGroupMappingGetRulesUrl,
  getUniqueConfigByConfigNameUrl
} from '@poss-web/shared/util-api-service';
import { OrderPaymentConfigAdaptor } from '@poss-web/shared/util-adaptors';
import { map, concatMap } from 'rxjs/operators';
import {
  OrderPayementRulesRequest,
  OrderPaymentsRequest,
  OrderpyamentRulesResponse
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderPaymentConfigService {
  constructor(private apiService: ApiService) {}
  getOrderPaymentConfigList(
    pageIndex: number, 
    pageSize: number,
    description?: string
  ) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(url.path, { 
        description: description ? description : null,
        ruleType: 'ORDER_AB_PAYMENT_CONFIG' 
      }, url.params)
      .pipe(
        map(data => OrderPaymentConfigAdaptor.getConfigDetailsListData(data))
      );
  }
  updateIsActive(configId: string, data) {
    const url = getUpdateConfigurationUrl(configId, 'ORDER_AB_PAYMENT_CONFIG');
    return this.apiService.patch(url, data);
  }
  searchConfigDetailsByconfigName(configName: string) {
    const url = getSearchConfigByConfigNameUrl();
    return this.apiService
      .post(url, {
        description: configName,
        ruleType: 'ORDER_AB_PAYMENT_CONFIG'
      })
      .pipe(
        map(data => OrderPaymentConfigAdaptor.getConfigDetailsListData(data))
      );
  }

  uniqueConfigNameCheck(payload: string) {
    const url = getUniqueConfigByConfigNameUrl();
    return this.apiService
      .post(
        url.path, 
        {
          description: payload,
          ruleType: 'ORDER_AB_PAYMENT_CONFIG'
        },
        url.params
      )
      .pipe(
        map(data => data.totalElements)
      );
  }

  getSelectedConfigDetails(configId: string) {
    const url = getUpdateConfigurationUrl(configId, 'ORDER_AB_PAYMENT_CONFIG');
    return this.apiService
      .get(url)
      .pipe(map(data => OrderPaymentConfigAdaptor.getSelectedConfigData(data)));
  }

  getSelectedConfigPaymentDetails(
    payload: OrderPayementRulesRequest
  ): Observable<OrderpyamentRulesResponse> {
    const url = getProductGroupMappingGetRulesUrl(
      payload.pageIndex,
      payload.pageSize,
      payload.configId,
      payload.productGroupCode,
      'ORDER_AB_PAYMENT_CONFIG',
      payload.isPageable,
      payload.sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => OrderPaymentConfigAdaptor.getOrderPaymentDetails(data))
      );
  }
  saveOrderPaymentsConfig(configDetails, paymentRequest: OrderPaymentsRequest) {
    const url1 = getSaveConfigurationUrl('ORDER_AB_PAYMENT_CONFIG');
    return this.apiService
      .post(url1, configDetails)
      .pipe(map(details => details))
      .pipe(
        concatMap(configs => {
          return this.apiService
            .patch(
              getProductGroupMappingRulesUrl(
                configs.ruleId,
                'ORDER_AB_PAYMENT_CONFIG'
              ),
              paymentRequest
            )
            .pipe(map(data => data.ruleId));
        })
      );
  }
  removeConfig(configId: string, paymentRequest: any) {
    const url = getProductGroupMappingRulesUrl(
      configId,
      'ORDER_AB_PAYMENT_CONFIG'
    );
    return this.apiService
      .patch(url, paymentRequest)
      .pipe(
        map(data => OrderPaymentConfigAdaptor.getOrderPaymentDetails(data))
      );
  }
  updateConfig(configId: string, paymentRequest: any) {
    const url = getProductGroupMappingRulesUrl(
      configId,
      'ORDER_AB_PAYMENT_CONFIG'
    );

    return this.apiService
      .patch(url, paymentRequest)
      .pipe(
        map(data => OrderPaymentConfigAdaptor.getOrderPaymentDetails(data))
      );
  }
}
