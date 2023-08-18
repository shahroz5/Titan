import {
  StockRecevieItemAdaptor,
  StockReceiveStockHelper,
  StockReceiveItemHelper,
  StockReceiveStockAdaptor
} from '@poss-web/shared/util-adaptors';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  getStockReceiveByPaginationEndpointUrl,
  getStockReceiveBySrcDocNoEndpointUrl,
  getPurchaseInvoiceByPaginationEndpointUrl,
  getPurchaseInvoiceBySrcDocNoEndpointUrl,
  getStockReceiveConfirmSTNEndpointUrl,
  getStockReceiveVerifyItemEndpointUrl,
  getStockReceiveUpdateAllItemsEndpointUrl,
  getStockByIdEndpointUrl,
  getInvociePurchaseByIdEndpointUrl,
  getStockReceiveItemsEndpointUrl,
  ApiService,
  getStockReceiveHistoryEndPointUrl,
  getStockReceiveHistoryById,
  getStockReceiveHistroyItemsEndpointUrl,
  getStockReceiveCFAHistoryUrl,
  getStockReceiveCFAHistroyItemsEndpointUrl,
  getStockReceiveCFAHistoryById,
  getFetchSTNFromOracleUrl,
  getFetchInvoiceFromOracleUrl,
  getTotalReceivedWeightEndpointUrl
} from '@poss-web/shared/util-api-service';
import {
  StockReceiveTypeFieldEnum,
  StockReceiveItemStatusEnum,
  StockReceiveStock,
  StockReceiveItem,
  StockReceiveConfirmReceive,
  StockReceiveItemUpdate,
  StockReceiveLoadItemsTotalCountSuccessResponse,
  StoreTypes,
  StockReceiveTypesEnum,
  StockReceiveHistoryItem,
  StockReceiveHistory
} from '@poss-web/shared/models';
import { HttpParams } from '@angular/common/http';

/**
 * Stcok Receive Service
 */
@Injectable()
export class StockReceiveService {
  constructor(private apiService: ApiService) {}
  /**
   * Service to Get stocks from the server
   * @param type : type of transfer
   * @param pageIndex : next page index to be loaded
   * @param pageSize : Page Size to be loade
   */
  getStocks(
    type: string,
    pageIndex: number,
    pageSize: number
  ): Observable<StockReceiveStock[]> {
    const url = getStockReceiveByPaginationEndpointUrl(
      type,
      pageIndex,
      pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(
          (data: any) =>
            StockReceiveStockHelper.getStocks(
              data,
              StockReceiveTypeFieldEnum.STN
            ).stocks
        )
      );
  }

  /**
   * Service to Get Invoices from the server
   * @param type : type of transfer
   * @param pageIndex : next page index to be loaded
   * @param pageSize : Page Size to be loade
   */

  getInvoices(
    type: string,
    pageIndex: number,
    pageSize: number
  ): Observable<StockReceiveStock[]> {
    const url = getPurchaseInvoiceByPaginationEndpointUrl(
      type,
      pageIndex,
      pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(
          (data: any) =>
            StockReceiveStockHelper.getStocks(
              data,
              StockReceiveTypeFieldEnum.INVOICE
            ).stocks
        )
      );
  }

  /**
   * Service to Search stocks from the server by srcDocNumber and  type of transfer (L1/L2)
   * @param srcdocno : srcdocno
   * @param type : type of transfer
   */
  searchStocks(
    srcdocno: string,
    type: string
  ): Observable<StockReceiveStock[]> {
    const url = getStockReceiveBySrcDocNoEndpointUrl(srcdocno, type);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(
          (data: any) =>
            StockReceiveStockHelper.getStocks(
              data,
              StockReceiveTypeFieldEnum.STN
            ).stocks
        )
      );
  }

  fetchSTNFromOracle(
    srcdocno: number,
    type: string
  ): Observable<StockReceiveStock[]> {
    const url = getFetchSTNFromOracleUrl(srcdocno, type);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(
          (data: any) =>
            StockReceiveStockHelper.getStocks(
              data,
              StockReceiveTypeFieldEnum.STN
            ).stocks
        )
      );
  }

  fetchInvoiceFromOracle(
    srcdocno: number,
    type: string
  ): Observable<StockReceiveStock[]> {
    const url = getFetchInvoiceFromOracleUrl(srcdocno, type);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(
          (data: any) =>
            StockReceiveStockHelper.getStocks(
              data,
              StockReceiveTypeFieldEnum.INVOICE
            ).stocks
        )
      );
  }

  /**
   * Service to Search invoices from the server by srcDocNumber and  type of transfer (L3)
   * @param srcdocno : srcdocno
   * @param type : type of transfer
   */
  searchInovices(
    srcdocno: string,
    type: string
  ): Observable<StockReceiveStock[]> {
    const url = getPurchaseInvoiceBySrcDocNoEndpointUrl(srcdocno, type);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(
          (data: any) =>
            StockReceiveStockHelper.getStocks(
              data,
              StockReceiveTypeFieldEnum.INVOICE
            ).stocks
        )
      );
  }

  /**
   * Service to get Stock by srcdocno and Type (L1/L2)
   * @param srcdocno : srcdocno
   * @param type : type of transfer
   */
  getStock(
    id: string,
    type: string,
    historyApiType: string
  ): Observable<StockReceiveStock> {
    let url: { path: string; params: HttpParams };
    if (type === StockReceiveTypesEnum.HISTORY) {
      url = getStockReceiveHistoryById(id, historyApiType);
    } else {
      url = getStockByIdEndpointUrl(id, type);
    }
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          StockReceiveStockAdaptor.fromJson(data, StockReceiveTypeFieldEnum.STN)
        )
      );
  }

  /**
   * Service to get Invoice by srcdocno and Type (L3)
   * @param srcdocno : srcdocno
   * @param type : type of transfer
   */
  getInvoice(
    id: string,
    type: string,
    historyApiType: string
  ): Observable<StockReceiveStock> {
    let url: { path: string; params: HttpParams };
    if (type === StockReceiveTypesEnum.HISTORY) {
      url = getStockReceiveCFAHistoryById(id, historyApiType);
    } else {
      url = getInvociePurchaseByIdEndpointUrl(id, type);
    }
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          StockReceiveStockAdaptor.fromJson(
            data,
            StockReceiveTypeFieldEnum.INVOICE
          )
        )
      );
  }

  getItemsCount(
    storeType: string,
    type: string,
    id: number
  ): Observable<StockReceiveLoadItemsTotalCountSuccessResponse> {
    const nonVerifiedCountUrl = getStockReceiveItemsEndpointUrl(
      storeType,
      type,
      StockReceiveItemStatusEnum.ISSUED,
      id,
      null,
      null,
      0,
      1,
      null,
      null,
      null
    );
    const verifiedCountUrl = getStockReceiveItemsEndpointUrl(
      storeType,
      type,
      StockReceiveItemStatusEnum.VERIFIED,
      id,
      null,
      null,
      0,
      1,
      null,
      null,
      null
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

  getItems(
    storeType: string,
    type: string,
    status: string,
    id: number,
    itemCode: string,
    lotNumber: string,
    pageIndex: number,
    pageSize: number,
    sortBy: string,
    sortOrder: string,
    filter: { key: string; value: any[] }[],
    studdedProductGroups: string[] = []
  ): Observable<{ items: StockReceiveItem[]; count: number }> {
    let url: { path: string; params: HttpParams };
    url = getStockReceiveItemsEndpointUrl(
      storeType,
      type,
      status,
      id,
      itemCode,
      lotNumber,
      pageIndex,
      pageSize,
      sortBy,
      sortOrder,
      filter
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          StockReceiveItemHelper.getItems(data, studdedProductGroups)
        )
      );
  }

  verifyItem(
    storeType: string,
    type: string,
    id: number,
    itemId: string,
    itemUpdate: StockReceiveItemUpdate,
    studdedProductGroups: string[] = []
  ): Observable<StockReceiveItem> {
    const url = getStockReceiveVerifyItemEndpointUrl(
      storeType,
      type,
      id,
      itemId
    );
    return this.apiService
      .patch(url.path, itemUpdate, url.params)
      .pipe(
        map((data: any) =>
          StockRecevieItemAdaptor.fromJson(data, studdedProductGroups)
        )
      );
  }

  getTotalReceivedWeight(storeType: string, type: string, id: number) {
    const url = getTotalReceivedWeightEndpointUrl(
      storeType,
      type,
      StockReceiveItemStatusEnum.VERIFIED,
      id
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          StockReceiveStockAdaptor.mapTotalMeasuredWeight(data)
        )
      );
  }
  updateAllItems(
    storeType: string,
    type: string,
    id: number,
    request: any
  ): Observable<any> {
    const url = getStockReceiveUpdateAllItemsEndpointUrl(storeType, type, id);
    return this.apiService.patch(url.path, request, url.params);
  }

  confirmStn(
    storeType: string,
    type: string,
    id: number,
    confirmReceive: StockReceiveConfirmReceive
  ): Observable<any> {
    const url = getStockReceiveConfirmSTNEndpointUrl(storeType, type, id);
    return this.apiService.patch(url.path, confirmReceive, url.params).pipe(
      map((data: any) => {
        if (
          storeType === StoreTypes.LargeFormatStoreType ||
          storeType === StoreTypes.MediumFormatStoreType
        ) {
          return StockReceiveStockAdaptor.fromJson(
            data,
            StockReceiveTypeFieldEnum.STN
          );
        } else if (storeType === StoreTypes.SmallFormatStoreType) {
          return StockReceiveStockAdaptor.fromJson(
            data,
            StockReceiveTypeFieldEnum.INVOICE
          );
        }
      })
    );
  }

  getStockReceiveHistory(
    data: StockReceiveHistory,
    pageIndex: number,
    pageSize: number,
    transferType: string,
    sort: string[]
  ) {
    const url = getStockReceiveHistoryEndPointUrl(
      pageIndex,
      pageSize,
      transferType,
      sort
    );
    return this.apiService
      .post(url.path, data, url.params)
      .pipe(
        map((result: any) =>
          StockReceiveStockHelper.getStocks(
            result,
            StockReceiveTypeFieldEnum.STN
          )
        )
      );
  }
  getStockReceiveInvoiceHistory(
    data: StockReceiveHistory,
    pageIndex: number,
    pageSize: number,
    invoiceType: string,
    sort: string[]
  ) {
    const url = getStockReceiveCFAHistoryUrl(
      pageIndex,
      pageSize,
      invoiceType,
      sort
    );
    return this.apiService
      .post(url.path, data, url.params)
      .pipe(
        map((result: any) =>
          StockReceiveStockHelper.getStocks(
            result,
            StockReceiveTypeFieldEnum.INVOICE
          )
        )
      );
  }
  getHistoryItems(
    stockReceiveHistoryItems: StockReceiveHistoryItem,
    id: string,
    pageIndex: number,
    pageSize: number,
    isL1L2Store: boolean,
    isL3Store: boolean,
    sort: string[],
    historyApiType: string,
    studdedProductGroups: string[] = []
  ) {
    let url;
    if (isL1L2Store) {
      url = getStockReceiveHistroyItemsEndpointUrl(
        id,
        pageIndex,
        pageSize,
        sort,
        historyApiType
      );
    } else if (isL3Store) {
      url = getStockReceiveCFAHistroyItemsEndpointUrl(
        id,
        pageIndex,
        pageSize,
        sort,
        historyApiType
      );
    }
    return this.apiService
      .post(url.path, stockReceiveHistoryItems, url.params)
      .pipe(
        map((data: any) =>
          StockReceiveItemHelper.getItems(data, studdedProductGroups)
        )
      );
  }
}
