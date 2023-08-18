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
import { CoOrderPaymentConfigAdaptor } from '@poss-web/shared/util-adaptors';
import { map, concatMap } from 'rxjs/operators';
import {
  CoOrderPayementRulesRequest,
  CoOrderPaymentsRequest,
  CoOrderpyamentRulesResponse
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CoOrderPaymentConfigService {
  constructor(private apiService: ApiService) {}
  getCoOrderPaymentConfigList(
    pageIndex: number,
    pageSize: number,
    description?: string
  ) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(
        url.path,
        {
          description: description ? description : null,
          ruleType: 'ORDER_CO_PAYMENT_CONFIG'
        },
        url.params
      )
      .pipe(
        map(data => CoOrderPaymentConfigAdaptor.getConfigDetailsListData(data))
      );
  }
  updateIsActive(configId: string, data) {
    const url = getUpdateConfigurationUrl(configId, 'ORDER_CO_PAYMENT_CONFIG');
    return this.apiService.patch(url, data);
  }
  searchConfigDetailsByconfigName(configName: string) {
    const url = getSearchConfigByConfigNameUrl();
    return this.apiService
      .post(url, {
        description: configName,
        ruleType: 'ORDER_CO_PAYMENT_CONFIG'
      })
      .pipe(
        map(data => CoOrderPaymentConfigAdaptor.getConfigDetailsListData(data))
      );
  }

  uniqueConfigNameCheck(payload: string) {
    const url = getUniqueConfigByConfigNameUrl();
    return this.apiService
      .post(
        url.path,
        {
          description: payload,
          ruleType: 'ORDER_CO_PAYMENT_CONFIG'
        },
        url.params
      )
      .pipe(map(data => data.totalElements));
  }

  getSelectedConfigDetails(configId: string) {
    const url = getUpdateConfigurationUrl(configId, 'ORDER_CO_PAYMENT_CONFIG');
    return this.apiService
      .get(url)
      .pipe(
        map(data => CoOrderPaymentConfigAdaptor.getSelectedConfigData(data))
      );
  }

  getSelectedConfigPaymentDetails(
    payload: CoOrderPayementRulesRequest
  ): Observable<CoOrderpyamentRulesResponse> {
    const url = getProductGroupMappingGetRulesUrl(
      payload.pageIndex,
      payload.pageSize,
      payload.configId,
      payload.productGroupCode,
      'ORDER_CO_PAYMENT_CONFIG',
      payload.isPageable,
      payload.sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CoOrderPaymentConfigAdaptor.getCoOrderPaymentDetails(data))
      );
  }
  saveCoOrderPaymentsConfig(
    configDetails,
    paymentRequest: CoOrderPaymentsRequest
  ) {
    const url1 = getSaveConfigurationUrl('ORDER_CO_PAYMENT_CONFIG');
    return this.apiService
      .post(url1, configDetails)
      .pipe(map(details => details))
      .pipe(
        concatMap(configs => {
          return this.apiService
            .patch(
              getProductGroupMappingRulesUrl(
                configs.ruleId,
                'ORDER_CO_PAYMENT_CONFIG'
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
      'ORDER_CO_PAYMENT_CONFIG'
    );
    return this.apiService
      .patch(url, paymentRequest)
      .pipe(
        map(data => CoOrderPaymentConfigAdaptor.getCoOrderPaymentDetails(data))
      );
  }
  updateConfig(configId: string, paymentRequest: any) {
    const url = getProductGroupMappingRulesUrl(
      configId,
      'ORDER_CO_PAYMENT_CONFIG'
    );

    return this.apiService
      .patch(url, paymentRequest)
      .pipe(
        map(data => CoOrderPaymentConfigAdaptor.getCoOrderPaymentDetails(data))
      );
  }
}
