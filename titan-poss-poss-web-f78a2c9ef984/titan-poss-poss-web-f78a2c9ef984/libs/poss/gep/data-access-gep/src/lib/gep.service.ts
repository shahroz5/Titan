import { GepAdaptor, GepHelper } from '@poss-web/shared/util-adaptors';

import { Injectable } from '@angular/core';
import {
  ApiService,
  getGepInitUrl,
  postGepUrl,
  getCancelUrl,
  saveCancelUrl,
  deleteGEPUrl,
  getOnHoldCountUrl,
  getOnHoldUrl,
  metalUrl,
  deleteGepUrl,
  holdConfirmUrl,
  getGepItemUrl,
  putGepItemUrl,
  postRsoUrl,
  updatePriceUrl,
  postTotalBreakUpUrl,
  metalTypeUrl,
  itemTypeUrl,
  manualBillListUrl,
  downloadManualBillUrl,
  uploadManualBillUrl,
  getGEPHistoryEndPointUrl,
  getGoodExchangeUrl,
  getAvailableDiscountsEndPointUrl
} from '@poss-web/shared/util-api-service';
import * as gepActions from './+state/gep.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AdvanceHistoryItemsRequestPayload,
  DiscountListPayload,
  DiscountsList,
  GepInitResponse,
  GEPSearchResponse,
  totalBreakUp,
  TransactionTypeEnum
} from '@poss-web/shared/models';

@Injectable({
  providedIn: 'root'
})
export class GepService {
  txnType = TransactionTypeEnum.GEP;
  getGepInit(gepInit: gepActions.GepInitPayload): Observable<GepInitResponse> {
    const url = getGepInitUrl(gepInit.subTxnType);

    return this.apiService
      .post(url.path, gepInit.data, url.params)
      .pipe(map((data: any) => data));
  }

  postGepResponse(gep: gepActions.GepItemPayload): Observable<any> {
    const url = postGepUrl(gep.subTxnType, gep.id);

    return this.apiService
      .post(url.path, gep.data, url.params)
      .pipe(map((data: any) => GepAdaptor.gepfromJson(data)));
  }

  metalType(data: string): Observable<any> {
    const url = metalTypeUrl(data);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((mapData: any) => mapData.results));
  }
  itemType(data: string): Observable<any> {
    const url = itemTypeUrl(data);

    return this.apiService
      .get(url)
      .pipe(map((mapData: any) => mapData.results));
  }
  metalPrice(data): Observable<any> {
    const url = metalUrl(data);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((mapData: any) => mapData));
  }

  postTotalBreakUp(data: gepActions.GepPriceRequest): Observable<totalBreakUp> {
    const url = postTotalBreakUpUrl();

    return this.apiService.post(url, data).pipe(map((mapData: any) => mapData));
  }

  delete(data: gepActions.DeletePayload): Observable<any> {
    const url = deleteGepUrl(data);

    return this.apiService
      .delete(url.path, url.params)
      .pipe(map((mapData: any) => mapData));
  }

  getGepItemDetails(data: gepActions.DeletePayload): Observable<any> {
    const url = deleteGepUrl(data);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((mapData: any) => GepAdaptor.onHoldfromJson(mapData)));
  }

  holdConfirm(data: gepActions.HoldPayload): Observable<any> {
    const url = holdConfirmUrl(data);

    return this.apiService
      .put(url.path, data.data, url.params)
      .pipe(map((mapData: any) => mapData));
  }

  patchRso(gep: gepActions.GepItemPayload): Observable<any> {
    const url = postRsoUrl(gep.subTxnType, gep.id);

    return this.apiService
      .patch(url.path, gep.data, url.params)
      .pipe(map((data: any) => data));
  }

  putGepItem(gep: gepActions.PatchItemPayload): Observable<any> {
    const url = putGepItemUrl(gep);

    return this.apiService
      .put(url.path, gep.data, url.params)
      .pipe(map((data: any) => GepAdaptor.gepfromJson(data)));
  }

  updatePrice(gep: gepActions.LoadGepPayload): Observable<any> {
    const url = updatePriceUrl(gep);

    return this.apiService
      .patch(url.path, {}, url.params)
      .pipe(map((data: any) => data));
  }

  getGepItem(gep: gepActions.LoadGepPayload): Observable<any> {
    const url = getGepItemUrl(gep);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data));
  }

  loadCancel(gep: gepActions.LoadCanclPayload): Observable<any> {
    const url = getCancelUrl(gep);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => GepHelper.getcancelGeps(data)));
  }

  loadOnHold(gep: gepActions.LoadOnHoldPayload): Observable<any> {
    const url = getOnHoldUrl(gep);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data));
  }

  countGep(gep: gepActions.LoadOnHoldPayload): Observable<any> {
    const url = getOnHoldCountUrl(gep);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.results));
  }

  saveCancel(gep: gepActions.GepInitPayload): Observable<any> {
    const url = saveCancelUrl(gep);

    return this.apiService
      .post(url.path, gep.data, url.params)
      .pipe(map((data: any) => data));
  }

  deleteGep(gep: gepActions.LoadGepPayload): Observable<any> {
    const url = deleteGEPUrl(gep);

    return this.apiService
      .delete(url.path, url.params)
      .pipe(map((data: any) => data));
  }

  upload(gep: gepActions.FileUploadPayload): Observable<any> {
    const url = uploadManualBillUrl(gep);

    return this.apiService
      .postImage(url, gep.file, 'text')
      .pipe(map((data: any) => data));
  }

  uploadFileList(fileDetails: gepActions.FileUploadPayload): Observable<any> {
    const url = manualBillListUrl(fileDetails);
    return this.apiService.get(url).pipe(map((idData: any) => idData.results));
  }

  downloadFile(data: { id: string; locationCode: string }): Observable<any> {
    const url = downloadManualBillUrl(data);
    return this.apiService.get(url).pipe(map((idData: any) => idData.url));
  }

  getHistoryItems(
    requestPayload: AdvanceHistoryItemsRequestPayload,
    searchField?: string,
    searchType?: string,
    status?: string,
    page?: number,
    size?: number,
    txnType?: string,
    subTxnType?: string
  ): Observable<GEPSearchResponse> {
    const urlObject = getGEPHistoryEndPointUrl(
      subTxnType,
      txnType,
      searchField,
      searchType,
      status,
      page,
      size
    );
    return this.apiService
      .post(urlObject.path, requestPayload, urlObject.params)
      .pipe(map((res: any) => GepHelper.getHistoryDetails(res)));
  }

  getGEPTransactionDetails(id: string, subTxnType: string): Observable<any> {
    const urlObject = getGoodExchangeUrl(id, subTxnType, this.txnType);
    const viewGEPTransactionUrl = urlObject.path;
    const params = urlObject.params;

    return this.apiService
      .get(viewGEPTransactionUrl, params)
      .pipe(map(data => data));
  }

  getAvailableDiscounts(
    payload: DiscountListPayload
  ): Observable<DiscountsList[]> {
    const urlObj = getAvailableDiscountsEndPointUrl(payload);
    return this.apiService.get(urlObj.path, urlObj.params).pipe(
      map((data: { results: DiscountsList[] }) => {
        return data?.results && data?.results?.length > 0 ? data?.results : [];
      })
    );
  }

  constructor(private apiService: ApiService) {}
}
