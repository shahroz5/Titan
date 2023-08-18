import { Injectable } from '@angular/core';
import {
  ApiService,
  getSaveBankDetailsUrl,
  getUpdateBankDetailsUrl,
  getBankDetailsByIdUrl,
  getCashBackOfferListUrl,
  getloadPayerBankList,
  getOfferDetailsByIdUrl,
  getMappedProductGroupByIdUrl,
  getCardDetailsUrl,
  getUpdateCardDetailsUrl,
  getCashBackOfferListWithSearchUrl,
  getFileUploadCommonUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import {
  SaveBankDetailsPayload,
  UpdateBankDetailsPayload,
  SaveProductGroupPayload,
  FileGroupEnum
} from '@poss-web/shared/models';
import { CashbackOfferConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class CashbackOfferConfigurationService {
  constructor(private apiService: ApiService) { }

  loadPayerBankList(isCashBack?: boolean) {
    const url = getloadPayerBankList(isCashBack);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CashbackOfferConfigurationAdaptor.getPayerBankList(data))
      );
  }
  loadCashbackOfferList(
    pageIndex: number,
    pageSize: number,
    searchValue: string
  ) {
    let url;
    if (searchValue) {
      url = getCashBackOfferListWithSearchUrl(pageIndex, pageSize, searchValue);
    } else {
      url = getCashBackOfferListUrl(pageIndex, pageSize);
    }
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          CashbackOfferConfigurationAdaptor.getCashBackOfferList(data)
        )
      );
  }

  saveBankDetails(saveBankDetails: SaveBankDetailsPayload) {
    const url = getSaveBankDetailsUrl();
    return this.apiService
      .post(url, saveBankDetails)
      .pipe(
        map(data => CashbackOfferConfigurationAdaptor.getBankDetails(data))
      );
  }
  updateBankDetails(id: string, updateBankDetails: UpdateBankDetailsPayload) {
    const url = getUpdateBankDetailsUrl(id);
    return this.apiService
      .patch(url, updateBankDetails)
      .pipe(
        map(data => CashbackOfferConfigurationAdaptor.getBankDetails(data))
      );
  }

  loadBankDetailsByConfigId(configId: string) {
    const url = getBankDetailsByIdUrl(configId);
    return this.apiService
      .get(url)
      .pipe(
        map(data => CashbackOfferConfigurationAdaptor.getBankDetails(data))
      );
  }

  loadOfferDetailsById(id: string) {
    const url = getOfferDetailsByIdUrl(id);
    return this.apiService
      .get(url)
      .pipe(
        map(data => CashbackOfferConfigurationAdaptor.getOfferDetails(data))
      );
  }
  clearOfferDetailsById(id: string, data: any) {
    const url = getOfferDetailsByIdUrl(id);
    return this.apiService.patch(url, data);
  }
  updateOfferDetailsById(id: string, data: any) {
    const url = getOfferDetailsByIdUrl(id);
    return this.apiService.patch(url, data);
  }
  loadMappedProductGroupById(id: string) {
    const url = getMappedProductGroupByIdUrl(id);
    return this.apiService
      .get(url)
      .pipe(
        map(data =>
          CashbackOfferConfigurationAdaptor.getMappedProductGroup(data)
        )
      );
  }
  updateProductGroupById(saveProductGroupPayload: SaveProductGroupPayload) {
    const url = getMappedProductGroupByIdUrl(saveProductGroupPayload.id);
    return this.apiService.patch(url, saveProductGroupPayload.data);
  }

  uploadCardDetailsById(id: string, formData: FormData) {
    const uploadUrl = getFileUploadCommonUrl(FileGroupEnum.CARD_DETAILS, id);

    return this.apiService
      .postFile(uploadUrl.path, formData, uploadUrl.params)
      .pipe(
        map(data =>
          CashbackOfferConfigurationAdaptor.getFileUploadResponse(data)
        )
      );
  }
  loadCardDetailsById(id: string, pageEvent) {
    const url = getCardDetailsUrl(id, pageEvent.pageIndex, pageEvent.pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CashbackOfferConfigurationAdaptor.getCardDetails(data))
      );
  }
  updateCardDetailsById(id: string, data: any) {
    const url = getUpdateCardDetailsUrl(id);
    return this.apiService.patch(url, { updateCards: data });
  }
  loadNewBankDetails() {
    const data = CashbackOfferConfigurationAdaptor.getBankDetails(false);
    return data;
  }
}
