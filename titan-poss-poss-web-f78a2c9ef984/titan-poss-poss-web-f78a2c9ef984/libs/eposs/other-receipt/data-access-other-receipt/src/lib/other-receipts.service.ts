import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  getOtherReciveCountEndpointUrl,
  getOtherReceiveByPaginationEndpointUrl,
  getOtherReceiveItemsByPaginationEndpointUrl,
  getOtherReceiptsSortItemsByPaginationEndpointUrl,
  getAdjustmentConfirmUrl,
  getotherReceiveStockByIdEndpointUrl,
  getSearchOtherReceiptItemsByItemCodeUrl,
  getOtherReceiveVerifyItemEndpointUrl,
  getUpdateAllOtherReceiptItemsEndpointUrl,
  getConfirmOtherReceiptSTNEndpointUrl,
  getOtherReceiveBySrcDocNoEndpointUrl,
  getOtherReceiptIssueHistoryByPaginationEndpointUrl,
  getOtherReceiptsSelectedHistoryUrl,
  getOtherReceiptIssueHistoryItemsByPaginationEndpointUrl,
  getPrintOtherReceivesEndpointUrl
} from '@poss-web/shared/util-api-service';

import { map, mergeMap } from 'rxjs/operators';
import { ApiService } from '@poss-web/shared/util-api-service';
import {
  OtherReceiptsDataModel,
  OtherReceiptsModel,
  OtherReceiptItem,
  ConfirmOtherReceive,
  LoadDropDownPayload,
  LoadOtherReceiptsSTNCountPayload,
  OtherReceiptLoadItemsTotalCountSuccessPayload,
  OtherReceiptConfirmAdjustmentItemsPayload,
  OtherReceiptItemUpdate,
  OtherReceiptHistoryPayload,
  OtherIssueHistoryItemsPayload,
  responseTypeEnum
} from '@poss-web/shared/models';

import {
  OtherReceiptsAdaptor,
  OtherReceiveItemHelper
} from '@poss-web/shared/util-adaptors';

@Injectable()
export class OtherReceiptService {
  constructor(private apiService: ApiService) {}

  // other receipts
  getOtherReceiptsSTNCount(): Observable<LoadOtherReceiptsSTNCountPayload> {
    const STNCountUrl = getOtherReciveCountEndpointUrl();
    return this.apiService
      .get(STNCountUrl)
      .pipe(
        map((data: any) => OtherReceiptsAdaptor.receiptSTNCountFromJson(data))
      );
  }
  getOtherReceiptsDropDown(): Observable<LoadDropDownPayload> {
    const STNCountUrl = getOtherReciveCountEndpointUrl();
    return this.apiService
      .get(STNCountUrl)
      .pipe(
        map((data: any) =>
          OtherReceiptsAdaptor.OtherRecieptsDropdownfromJson(data)
        )
      );
  }

  getReceiptsList(
    type: string,
    pageIndex: number,
    pageSize: number
  ): Observable<OtherReceiptsDataModel> {
    const url = getOtherReceiveByPaginationEndpointUrl(
      type,
      pageIndex,
      pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => OtherReceiveItemHelper.getOtherReceiptsData(data))
      );
  }
  searchRecieptsStocks(
    srcdocno: number,
    type: string
  ): Observable<OtherReceiptsModel[]> {
    const url = getOtherReceiveBySrcDocNoEndpointUrl(srcdocno, type);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          OtherReceiveItemHelper.getStockTransferNotes(data.results)
        )
      );
  }
  getOtherReceiveItemsCount(
    transactionType: string,
    id: number
  ): Observable<OtherReceiptLoadItemsTotalCountSuccessPayload> {
    const nonVerifiedCountUrl = getOtherReceiveItemsByPaginationEndpointUrl(
      id,
      'ISSUED',
      0,
      1,
      transactionType
    );
    const verifiedCountUrl = getOtherReceiveItemsByPaginationEndpointUrl(
      id,
      'VERIFIED',
      0,
      1,
      transactionType
    );
    return this.apiService
      .get(nonVerifiedCountUrl.path, nonVerifiedCountUrl.params)
      .pipe(map((data: any) => data.totalElements))
      .pipe(
        mergeMap(nonVerifiedItemsTotalCount =>
          this.apiService
            .get(verifiedCountUrl.path, verifiedCountUrl.params)
            .pipe(
              map((data: any) => ({
                nonVerifiedItemsTotalCount: nonVerifiedItemsTotalCount,
                verifiedItemsTotalCount: data.totalElements
              }))
            )
        )
      );
  }
  getTempSortItems(
    id: number,
    status: string,
    pageIndex: number,
    pageSize: number,
    sortBy: string,
    property: string,
    transactionType: string,
    studdedProductGroups: string[],
    itemCode?: string,
    lotNumber?: string,
    sort?: Map<string, string>,
    filter?: { key: string; value: any[] }[]
  ): Observable<{ items: OtherReceiptItem[]; count: number }> {
    const url = getOtherReceiptsSortItemsByPaginationEndpointUrl(
      id,
      status,
      pageIndex,
      pageSize,
      sortBy,
      property,
      transactionType,
      itemCode,
      lotNumber,
      sort,
      filter
    );
    return this.apiService
      .get(url)
      .pipe(
        map((data: any) =>
          OtherReceiveItemHelper.getItems(data, studdedProductGroups)
        )
      );
  }

  confirmAdjustementItems(
    confirmAdjustementItems: OtherReceiptConfirmAdjustmentItemsPayload
  ) {
    const url = getAdjustmentConfirmUrl(confirmAdjustementItems.type);
    return this.apiService
      .post(
        url.path,
        {
          items: confirmAdjustementItems.items,
          remarks: confirmAdjustementItems.remarks
        },
        url.params
      )
      .pipe(map((data: any) => OtherReceiptsAdaptor.AdjustementConfirm(data)));
  }
  getOtherReceiptStock(
    id: string,
    transactionType: string
  ): Observable<OtherReceiptsModel> {
    const url = getotherReceiveStockByIdEndpointUrl(id, transactionType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => OtherReceiptsAdaptor.OtherReceiptsDatafromJson(data))
      );
  }
  searchOtherReceiptItems(
    id: number,
    itemCode: string,
    lotNumber: string,
    status: string,
    transactionType: string,
    studdedProductGroups: string[]
  ): Observable<{ items: OtherReceiptItem[]; count: number }> {
    const url = getSearchOtherReceiptItemsByItemCodeUrl(
      id,
      itemCode,
      lotNumber,
      status,
      transactionType
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          OtherReceiveItemHelper.getItems(data, studdedProductGroups)
        )
      );
  }
  verifyOtherReceiptItem(
    id: number,
    itemId: string,
    itemUpdate: OtherReceiptItemUpdate,
    transactionType: string,
    studdedProductGroups: string[]
  ): Observable<OtherReceiptItem> {
    const url = getOtherReceiveVerifyItemEndpointUrl(
      id,
      itemId,
      transactionType
    );
    return this.apiService
      .patch(url.path, itemUpdate, url.params)
      .pipe(
        map((data: any) =>
          OtherReceiptsAdaptor.OtherReceiptItemfromJson(
            data,
            studdedProductGroups
          )
        )
      );
  }
  updateAllOtherReceiptItems(
    id: number,
    request: any,
    transactionType: string
  ): Observable<any> {
    const url = getUpdateAllOtherReceiptItemsEndpointUrl(id, transactionType);
    return this.apiService.patch(url.path, request, url.params);
  }
  confirmOtherReceiveStn(
    id: number,
    confirmReceive: ConfirmOtherReceive,
    transactionType: string
  ): Observable<any> {
    const url = getConfirmOtherReceiptSTNEndpointUrl(id, transactionType);
    return this.apiService.patch(url.path, confirmReceive, url.params).pipe(
      map((data: any) => {
        return OtherReceiptsAdaptor.OtherReceiptsDatafromJson(data);
      })
    );
  }

  getHistory(
    page: number,
    size: number,
    sort: string,
    payload: OtherReceiptHistoryPayload,
    transactionType: string
  ): Observable<any> {
    const url = getOtherReceiptIssueHistoryByPaginationEndpointUrl(
      page,
      size,
      sort,
      transactionType
    );
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(
        map((data: any) => OtherReceiveItemHelper.getOtherReceiptsData(data))
      );
  }
  getSelectedHistory(id: number, transactionType: string): Observable<any> {
    const url = getOtherReceiptsSelectedHistoryUrl(id, transactionType);

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => OtherReceiptsAdaptor.OtherReceiptsDatafromJson(data))
      );
  }
  getHistoryItems(
    id: number,
    page: number,
    size: number,
    sort: string[],
    payload: OtherIssueHistoryItemsPayload,
    transactionType: string,
    studdedProductGroups: string[] = []
  ): Observable<{ items: OtherReceiptItem[]; count: number }> {
    const url = getOtherReceiptIssueHistoryItemsByPaginationEndpointUrl(
      id,
      page,
      size,
      sort,
      transactionType
    );
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(
        map((data: any) =>
          OtherReceiveItemHelper.getItems(data, studdedProductGroups)
        )
      );
  }

  getHistoryItemsTotalCount(
    id: number,
    page: number,
    size: number,
    sort: string[],
    payload: OtherIssueHistoryItemsPayload,
    transactionType: string
  ): Observable<number> {
    const url = getOtherReceiptIssueHistoryItemsByPaginationEndpointUrl(
      id,
      page,
      size,
      sort,
      transactionType
    );
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  printOtherIssue(id: number, requestType: string) {
    const printOtherissueURL = getPrintOtherReceivesEndpointUrl(
      id,
      requestType
    );
    this.apiService.ResponseContentType = responseTypeEnum.Text;
    return this.apiService
      .get(printOtherissueURL.path, printOtherissueURL.params)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
}
