import { Injectable } from '@angular/core';
import {
  ApiService,
  getPaymentConfigurationListUrl,
  getSearchPaymenConfigurationListUrl,
  getPaymentModeListUrl,
  getSavePaymentConfigurationUrl,
  getUpdatePaymentConfigurationDetailUrl,
  getUpdatePaymentConfigurationUrl,
  getTransactionTypesUrl,
  getLoadPaymentConfigurationUrl,
  getMappedCountUrl,
  getUpdateUrl,
  getSelectedTransactionCodeUrl,
  getPaymentModeCountUrl
} from '@poss-web/shared/util-api-service';
import { PaymentConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import { CheckBoxResponse, paymentConiguration } from '@poss-web/shared/models';

import { map, concatMap } from 'rxjs/operators';

@Injectable()
export class PaymentConfigurationService {
  constructor(private apiService: ApiService) {}

  getTcsPaymentMode(configId) {
    const url = getSelectedTransactionCodeUrl(configId, null);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PaymentConfigurationAdaptor.getTcsPaymentMode(data)));
  }
  getPaymentModeCount() {
    const url = getPaymentModeCountUrl();
    return this.apiService.get(url).pipe(map(data => data.totalElements));
  }
  getPaymentConfigurationList(pageIndex: number, pageSize: number, description?: string) {
    const url = getPaymentConfigurationListUrl(
      pageIndex,
      pageSize,
      paymentConiguration.paymentConfig,
      description
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          PaymentConfigurationAdaptor.getPaymentConfigurationListData(data)
        )
      );
  }

  searchPaymentConfigurationList(paymentName: string) {
    const url = getSearchPaymenConfigurationListUrl(
      paymentName,
      paymentConiguration.paymentConfig
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PaymentConfigurationAdaptor.getSearchResult(data)));
  }

  getPaymentModes(size) {
    let paymentModes;
    const url = getPaymentModeListUrl(size);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(res => {
          paymentModes = res;
        })
      )
      .pipe(
        concatMap(res =>
          this.apiService
            .get(getTransactionTypesUrl().path, getTransactionTypesUrl().params)
            .pipe(
              map(data => {
                return PaymentConfigurationAdaptor.getPaymentModesandTransactionTypes(
                  data,
                  paymentModes
                );
              })
            )
        )
      );
  }

  savePaymentConfiguration(paymentConfiguration: any, savedata: any) {
    const url = getSavePaymentConfigurationUrl();
    return this.apiService
      .post(url, paymentConfiguration)
      .pipe(map(details => details))
      .pipe(
        concatMap(configDetails => {
          return this.apiService
            .patch(
              getUpdatePaymentConfigurationDetailUrl(configDetails.configId),
              savedata
            )
            .pipe(map(data => data.configId));
        })
      );
  }
  updatePaymentConfiguration(configId: string, data: any) {
    const url = getUpdatePaymentConfigurationUrl(configId, data.isActive);
    return this.apiService.patch(url.path, null, url.params);
  }
  getPaymentConfigurationByConfigId(configId: string) {
    const url = getLoadPaymentConfigurationUrl(configId);
    return this.apiService
      .get(url)
      .pipe(
        map(data =>
          PaymentConfigurationAdaptor.getPaymentConfigurationByConfigIdData(
            data
          )
        )
      );
  }
  getSelectedPaymentConfigurationDetailsByConfigId(
    configId: string,
    newCount: number,
    paymentName?: string
  ) {
    const url = getSelectedTransactionCodeUrl(configId, paymentName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          PaymentConfigurationAdaptor.getSelectedPaymentConfigurationDetailsByConfigIdData(
            data,
            newCount,
            paymentName
          )
        )
      );
  }
  getMappedCount(configId: string) {
    const url = getMappedCountUrl(configId);
    return this.apiService
      .get(url)
      .pipe(map(data => PaymentConfigurationAdaptor.getMappedCountData(data)));
  }
  updateSelectedPaymentConfigurationDetailsByConfigId(
    configId: string,
    checkBoxResponse: CheckBoxResponse
  ) {
    const url = getUpdateUrl(configId);
    return this.apiService.patch(url, checkBoxResponse);
  }
}
