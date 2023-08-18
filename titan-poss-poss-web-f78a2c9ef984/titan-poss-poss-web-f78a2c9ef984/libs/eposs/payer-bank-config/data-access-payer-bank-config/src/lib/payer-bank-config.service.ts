import { Injectable } from '@angular/core';
import {
  ApiService,
  getPayerBankListingUrl,
  updatePayerBankConfigs,
  getSavePayerBanksUrl,
  getUpdatePayerBankConfigUrl,
  savePayerBankConfigUrl,
  getPayerBankSearchUrl,
  getLoadPayerBanksUrl,
  getSearchPayerBankNameUrl
} from '@poss-web/shared/util-api-service';
import {
  PayerBankConfigListingPayload,
  ToggleButtonPayload,
  SavePayerBankConfigDetailsPayload,
  UpdatePayerBankConfigPayload
} from '@poss-web/shared/models';
import { PayerBankConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import { of } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
@Injectable()
export class PayerBankConfigService {
  constructor(private apiService: ApiService) {}
  getPayerBankConfigListing(payload: PayerBankConfigListingPayload) {
    const url = getPayerBankListingUrl(payload.pageIndex, payload.pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => PayerBankConfigurationAdaptor.getPayerBankListing(data))
      );
  }
  searchConfigName(configName) {
    const url = getPayerBankSearchUrl(configName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          PayerBankConfigurationAdaptor.getPayerBankConfigSearch(data)
        )
      );
  }
  searchPayerBanks(payerBankName: string) {
    const url = getSearchPayerBankNameUrl(payerBankName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PayerBankConfigurationAdaptor.getSearchResult(data)));
  }
  savePayerBankDetails(savePayload: SavePayerBankConfigDetailsPayload) {
    const url = savePayerBankConfigUrl();
    return this.apiService
      .post(url, savePayload.configPayload)
      .pipe(map(details => details))
      .pipe(
        concatMap(configDetails => {
          return this.apiService
            .patch(
              getSavePayerBanksUrl(configDetails.id),
              savePayload.banksPayload
            )
            .pipe(map(data => data.results[0].configId));
        })
      );
  }
  payerBankDetailsById(id: string) {
    const url = getUpdatePayerBankConfigUrl(id);
    const url1 = getSavePayerBanksUrl(id);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => data))
      .pipe(
        concatMap(data =>
          this.apiService
            .get(url1)
            .pipe(
              map((banks: any) =>
                PayerBankConfigurationAdaptor.getPayerBankConfigs(data, banks)
              )
            )
        )
      );
  }
  updatePayerBankConfigDetails(updatePayload: UpdatePayerBankConfigPayload) {
    const url = getUpdatePayerBankConfigUrl(updatePayload.id);
    const url1 = getSavePayerBanksUrl(updatePayload.id);
    return this.apiService
      .patch(url, updatePayload.configPayload)
      .pipe(
        concatMap(configId =>
          this.apiService.patch(url1, updatePayload.banksPayload)
        )
      );
  }
  updateToggleButton(toggleButtonPayload: ToggleButtonPayload) {
    const url = updatePayerBankConfigs(toggleButtonPayload.id);
    return this.apiService.patch(url, {
      isActive: toggleButtonPayload.isActive
    });
  }
  loadPaymentModes() {
    return of([
      {
        value: 'CARD',
        description: 'CARD for payment'
      },
      {
        value: 'CHEQUE',
        description: 'CHEQUE'
      },
      {
        value: 'DD',
        description: 'DD'
      },
      {
        value: 'CashBack',
        description: 'CashBack'
      }
    ]);
  }
  loadPayerBanks(payload: PayerBankConfigListingPayload) {
    const url = getLoadPayerBanksUrl(payload.pageIndex, payload.pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PayerBankConfigurationAdaptor.getPayerBanks(data)));
  }
}
