import { Injectable } from '@angular/core';
import {
  CustomerTransactionConfigListPayload,
  UpdateStatus,
  SaveCustomerTranConfigDetails
} from '@poss-web/shared/models';
import {
  getCustomerTransactionConfigListUrl,
  ApiService,
  getSearchConfigNameUrl,
  getUpdateConfigStatus,
  getCustomersUrl,
  getCustomerTransactionConfigUrl,
  getCustomerTransactionDetailsUrl,
  getCustomerTranConfigValuesById,
  getCustomerTranConfigById,
  getTranTypesUrl
} from '@poss-web/shared/util-api-service';
import { map, concatMap } from 'rxjs/operators';
import { CustomerTransactionConfigAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class CustomerTransactionConfigService {
  constructor(private apiService: ApiService) {}
  loadConfigList(listPayload: CustomerTransactionConfigListPayload) {
    const url = getCustomerTransactionConfigListUrl(
      listPayload.pageIndex,
      listPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          CustomerTransactionConfigAdaptor.customerTransactionConfigList(data)
        )
      );
  }
  searchConfigName(configName: string) {
    const url = getSearchConfigNameUrl(configName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CustomerTransactionConfigAdaptor.searchByConfigName(data))
      );
  }
  updateStatus(statusPayload: UpdateStatus) {
    const url = getUpdateConfigStatus(
      statusPayload.configId,
      statusPayload.isActive
    );
    return this.apiService.patch(url.path, {}, url.params);
  }
  loadCustomers() {
    const url = getCustomersUrl();
    return this.apiService
      .get(url)
      .pipe(map(data => CustomerTransactionConfigAdaptor.getCustomers(data)));
  }
  saveCustomerTranConfigDetails(savePayload: SaveCustomerTranConfigDetails) {
    const url = getCustomerTransactionConfigUrl();
    return this.apiService
      .post(url, savePayload.createConfig)
      .pipe(map((data: any) => data.configId))
      .pipe(
        concatMap(configId =>
          this.apiService.patch(
            getCustomerTransactionDetailsUrl(configId),
            savePayload.configDetails
          )
        )
      )
      .pipe(map(data => data.configId));
  }
  updateCustomerTranConfigDetails(
    updatePayload: SaveCustomerTranConfigDetails
  ) {
    const url = getUpdateConfigStatus(
      updatePayload.configId,
      updatePayload.createConfig.isActive
    );
    return this.apiService
      .patch(url.path, {}, url.params)
      .pipe(map((data: any) => data.configId))
      .pipe(
        concatMap(configId =>
          this.apiService.patch(
            getCustomerTransactionDetailsUrl(updatePayload.configId),
            updatePayload.configDetails
          )
        )
      );
  }
  getCustomerTranConfigDetails(configId: string) {
    const url = getCustomerTranConfigById(configId);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => data))
      .pipe(
        concatMap(data =>
          this.apiService
            .get(getCustomerTranConfigValuesById(configId))
            .pipe(
              map((configValues: any) =>
                CustomerTransactionConfigAdaptor.getCustomerTranCOnfigValues(
                  data,
                  configValues
                )
              )
            )
        )
      );
  }

  getTransactionTypes(type: string) {
    const url = getTranTypesUrl(type);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CustomerTransactionConfigAdaptor.getTransactionTypes(data))
      );
  }
}
