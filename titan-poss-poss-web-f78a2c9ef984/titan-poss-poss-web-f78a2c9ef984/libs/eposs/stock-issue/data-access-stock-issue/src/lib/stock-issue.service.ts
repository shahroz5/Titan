import { Injectable } from '@angular/core';
import {
  ApiService,
  getCancelIssueItemsByPaginationEndpointUrl,
  getCancelIssueItemsCountEndpointUrl,
  getCancelIssueSTNCountEndpointUrl,
  getCancelIssueSTNEndpointUrl,
  regenerateFileEndpointUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';

import {
  getStockIssueByPaginationEndpointUrl,
  getIssueSTNCountEndpointUrl,
  getStockIssueBySrcDocNoEndpointUrl,
  getIssueItemsByPaginationEndpointUrl,
  getStockIssueRequestByIDEndpointUrl,
  getIssueUpdateAllItemEndpointUrl,
  getIssueUpdateItemEndpointUrl,
  getIssueItemsCountEndpointUrl,
  updateItemListStatusEndpointUrl,
  getStockIssueHistoryByPaginationEndpointUrl,
  getStockIssueSelectedHistoryUrl,
  getIssueHistoryItemsByPaginationEndpointUrl,
  getStockIssueInvoiceSelectedHistoryUrl,
  getIssueInvoiceHistoryItemsByPaginationEndpointUrl,
  getStockIssueCancelByPaginationEndpointUrl
} from '@poss-web/shared/util-api-service';
import { map, mergeMap } from 'rxjs/operators';
import {
  StockRequestNote,
  IssueInventoryItem,
  IssueItemUpdate,
  RequestList,
  MeasuredWeightAndValuePayload,
  LoadIssueHistoryPayload,
  StockissueHistoryItemsRequestPayload,
  LoadIssueItemsTotalCountSuccessPayload,
  LoadIssueSTNCountsPayload,
  RegenerateFileResponse,
  StockIssueAPIRequestTypesEnum
} from '@poss-web/shared/models';

import {
  IssueItemHelper,
  StockIssueAdaptor,
  IssueItemAdaptor,
  InterBoutiqueTransferAdaptor,
  StockIssueHelper
} from '@poss-web/shared/util-adaptors';
@Injectable()
export class StockIssueService {
  constructor(private apiService: ApiService) {}
  getIssues(
    requsetType: string,
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    const url = getStockIssueByPaginationEndpointUrl(
      requsetType,
      pageIndex,
      pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => StockIssueHelper.getIssues(data)));
  }

  getCount(): Observable<LoadIssueSTNCountsPayload> {
    const url = getIssueSTNCountEndpointUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => StockIssueAdaptor.IssueSTNCountFromJson(data)));
  }

  searchIssues(
    reqDocNo: number,
    requestType: string
  ): Observable<StockRequestNote[]> {
    const url = getStockIssueBySrcDocNoEndpointUrl(reqDocNo, requestType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => StockIssueHelper.getIssues(data).response));
  }

  getIssue(id: number, requestType: string): Observable<StockRequestNote> {
    const url = getStockIssueRequestByIDEndpointUrl(id, requestType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          StockIssueAdaptor.historyStockRequestNoteFromJson(data)
        )
      );
  }
  getItems(
    id: number,
    itemCode: string,
    lotNumber: string,
    requestType: string,
    storeType: string,
    status: string,
    pageIndex: number,
    pageSize: number,
    studdedProductGroups: string[] = [],
    sort?: Map<string, string>,
    filter?: { key: string; value: any[] }[]
  ): Observable<{ items: IssueInventoryItem[]; count: number }> {
    const url = getIssueItemsByPaginationEndpointUrl(
      id,
      itemCode,
      lotNumber,
      requestType,
      storeType,
      status,
      pageIndex,
      pageSize,
      sort,
      filter
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => IssueItemHelper.getItems(data, studdedProductGroups))
      );
  }
  getIssueItemsCount(
    storeType: string,
    id: number,
    requestType: string
  ): Observable<LoadIssueItemsTotalCountSuccessPayload> {
    const approvedItemsCountUrl = getIssueItemsCountEndpointUrl(
      storeType,
      id,
      0,
      1,
      requestType,
      'APPROVED'
    );
    const selecetedItemsCountUrl = getIssueItemsCountEndpointUrl(
      storeType,
      id,
      0,
      1,
      requestType,
      'SELECTED'
    );
    return this.apiService
      .get(approvedItemsCountUrl.path, approvedItemsCountUrl.params)
      .pipe(map((data: any) => data.totalElements))
      .pipe(
        mergeMap(approvedItemsTotalCount =>
          this.apiService
            .get(selecetedItemsCountUrl.path, selecetedItemsCountUrl.params)
            .pipe(
              map((data: any) => ({
                approvedItemsTotalCount: approvedItemsTotalCount,
                selectedItemsTotalCount: data.totalElements,
                historyItemsTotalCount: 0
              }))
            )
        )
      );
  }
  confirmIssue(id: number, data: any, requestType: string) {
    const url = getStockIssueRequestByIDEndpointUrl(id, requestType);
    return this.apiService.post(url.path, data, url.params).pipe(
      map((response: any) => {
        return StockIssueAdaptor.historyStockRequestNoteFromJson(response);
      })
    );
  }
  // validateItem(
  //   productGroupCode: string,
  //   availableWeight: number,
  //   measuredWeight: number,
  //   measuredQuantity: number,
  //   availableQuantity: number
  // ): Observable<any> {
  //   const url = getValidateItemEndpointUrl(
  //     productGroupCode,
  //     availableWeight,
  //     measuredWeight,
  //     measuredQuantity,
  //     availableQuantity,
  //     'WEIGHT_TOLERANCE'
  //   );
  //   return this.apiService.get(url.path, url.params);
  // }
  // TODO check adaptor..
  updateItem(
    requestType: string,
    storeType: string,
    id: number,
    itemId: number,
    itemUpdate: IssueItemUpdate,
    studdedProductGroups: string[] = []
  ): Observable<IssueInventoryItem> {
    const url = getIssueUpdateItemEndpointUrl(
      requestType,
      storeType,
      id,
      itemId
    );
    return this.apiService
      .patch(
        url.path,
        {
          inventoryId: itemUpdate.inventoryId,
          measuredQuantity: itemUpdate.measuredQuantity,
          measuredWeight: itemUpdate.measuredWeight
        },
        url.params
      )
      .pipe(
        map((data: any) =>
          IssueItemAdaptor.fromJson(data, studdedProductGroups)
        )
      );
  }

  updateAllItem(
    requestType: string,
    storeType: string,
    id: number,
    itemIds: any,
    status: string
  ): Observable<any> {
    const url = getIssueUpdateAllItemEndpointUrl(requestType, storeType, id);
    return this.apiService.patch(
      url.path,
      { itemIds: itemIds, status: status },
      url.params
    );
  }

  updateItemListStatus(
    status: string,
    id: number,
    itemIds: Array<string>,
    requestGroup: string,
    remarks: string
  ): Observable<RequestList> {
    const url = updateItemListStatusEndpointUrl(id, requestGroup);
    return this.apiService
      .patch(
        url.path,
        {
          itemIds,
          requestGroup,
          remarks,
          status
        },
        url.params
      )
      .pipe(
        map((data: any) => InterBoutiqueTransferAdaptor.requestFromJson(data))
      );
  }

  getWeightAndValue(
    id: number,
    requestType: string
  ): Observable<MeasuredWeightAndValuePayload> {
    const url = getStockIssueRequestByIDEndpointUrl(id, requestType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          StockIssueAdaptor.measuredWeightAndValueFromJson(data)
        )
      );
  }
  getHistory(
    page: number,
    size: number,
    sort: string[],
    payload: LoadIssueHistoryPayload,
    transferType: string,
    isLegacy?: boolean
  ): Observable<any> {
    const url = getStockIssueHistoryByPaginationEndpointUrl(
      page,
      size,
      sort,
      transferType,
      isLegacy
    );

    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(map((data: any) => StockIssueHelper.getIssues(data)));
  }

  getSelectedHistory(
    actionType: string,
    id: number,
    type: string,
    isL1L2Store: boolean,
    isL3Store: boolean
  ) {
    let url;
    if (isL1L2Store) {
      url = getStockIssueSelectedHistoryUrl(actionType, id, type);
    } else if (isL3Store) {
      console.log('type', type);
      url = getStockIssueInvoiceSelectedHistoryUrl(id, type);
    }

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          StockIssueAdaptor.historyStockRequestNoteFromJson(data)
        )
      );
  }
  getHistoryItems(
    actionType: string,
    id: number,
    page: number,
    size: number,
    sort: string[],
    payload: StockissueHistoryItemsRequestPayload,
    transferType: string,
    isL1L2Store: boolean,
    isL3Store: boolean,
    studdedProductGroups: string[] = []
  ) {
    console.log('transfer', transferType);
    let url;
    if (isL1L2Store) {
      url = getIssueHistoryItemsByPaginationEndpointUrl(
        actionType,
        id,
        page,
        size,
        sort,
        transferType
      );
    } else if (isL3Store) {
      url = getIssueInvoiceHistoryItemsByPaginationEndpointUrl(
        id,
        page,
        size,
        sort,
        transferType
      );
    }

    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(
        map((data: any) =>
          IssueItemHelper.getItems(
            data,
            studdedProductGroups,
            isL3Store && transferType === StockIssueAPIRequestTypesEnum.BTQ_CFA
              ? true
              : false
          )
        )
      );
  }
  getHistoryItemsCount(
    actionType: string,
    id: number,
    page: number,
    size: number,
    sort: string[],
    payload: StockissueHistoryItemsRequestPayload,
    transferType: string,
    isL1L2Store: boolean,
    isL3Store: boolean
  ) {
    let url;
    if (isL1L2Store) {
      url = getIssueHistoryItemsByPaginationEndpointUrl(
        actionType,
        id,
        page,
        size,
        sort,
        transferType
      );
    } else {
      url = getIssueInvoiceHistoryItemsByPaginationEndpointUrl(
        id,
        page,
        size,
        sort,
        transferType
      );
    }

    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  // cancel STN

  getIssuesCancelSTN(
    requsetType: string,
    pageIndex: number,
    pageSize: number,
    srcDocNo: number
  ): Observable<{ response: StockRequestNote[]; count: number }> {
    const url = getStockIssueCancelByPaginationEndpointUrl(
      requsetType,
      pageIndex,
      pageSize,
      srcDocNo
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => StockIssueHelper.getIssues(data)));
  }

  getCancelSTNCount(transferType: string): Observable<number> {
    const url = getCancelIssueSTNCountEndpointUrl(transferType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.count));
  }

  getCancelIssueSTNDetails(
    transferType: string,
    id: number
  ): Observable<StockRequestNote> {
    const url = getCancelIssueSTNEndpointUrl(transferType, id);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => StockIssueAdaptor.fromJson(data)));
  }

  getCancelIssueItems(
    id: number,
    page: number,
    size: number,
    sort: string[],
    transferType: string,
    binCodes: string[],
    binGroupCode: string,
    itemCode: string,
    lotNumber: string,
    productCategories: string[],
    productGroups: string[],
    studdedProductGroups: string[] = []
  ) {
    const url = getCancelIssueItemsByPaginationEndpointUrl(
      id,
      page,
      size,
      sort,
      transferType,
      binCodes,
      binGroupCode,
      itemCode,
      lotNumber,
      productCategories,
      productGroups
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => IssueItemHelper.getItems(data, studdedProductGroups))
      );
  }

  getCancelIssueItemsCount(transferType: string, id: number) {
    const url = getCancelIssueItemsCountEndpointUrl(transferType, id);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  getCancelIssueSTNRes(
    transferType: string,
    id: number,
    payload: {}
  ): Observable<StockRequestNote> {
    const url = getCancelIssueSTNEndpointUrl(transferType, id);
    return this.apiService
      .patch(url.path, payload, url.params)
      .pipe(map((data: any) => StockIssueAdaptor.fromJson(data)));
  }

  regenerateFile(
    invoiceType: string,
    id: number,
    payload: {}
  ): Observable<RegenerateFileResponse> {
    const url = regenerateFileEndpointUrl(invoiceType, id);
    return this.apiService
      .patch(url.path, payload, url.params)
      .pipe(map((data: any) => StockIssueAdaptor.regenerateFileFromJson(data)));
  }
}
